import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

export const assert = chai.assert

export { chai, chaiAsPromised }
