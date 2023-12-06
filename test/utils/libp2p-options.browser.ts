import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { mplex } from '@libp2p/mplex'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webRTCStar } from '@libp2p/webrtc-star'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { getAddrs } from './circuit-relay-addr'
import services, { type Services } from './libp2p-services'
import type { Libp2pOptions } from 'libp2p'

export async function createLibp2pOptions (opts: Libp2pOptions): Promise<Libp2pOptions<Services>> {
  const webRtcStar = webRTCStar()

  const options: Libp2pOptions = {
    addresses: {
      listen: [
        '/webrtc',
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/'
      ]
    },
    transports: [
      webSockets({ filter: filters.all }),
      circuitRelayTransport({
        discoverRelays: 1
      }),
      webRTC(),
      webRTCDirect(),
      webRtcStar.transport
    ],
    peerDiscovery: [
      webRtcStar.discovery,
      bootstrap({ list: [...(await getAddrs()).map(String), '/ip4/127.0.0.1/tcp/8001/ws/p2p/12D3KooWDoap6J1qAP17dvR8KgaknSZSFSamxFeggEc5Qzecqto3'] })
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux(), mplex()
    ],
    services,
    ...opts
  }

  return options
}
