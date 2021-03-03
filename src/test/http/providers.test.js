const { server, chai, expect, sinon, } = require('../sandbox');

const middleware = require('../../middleware');

describe('GET /providers', () => {
  let sandbox;
  let middlewareStub;

  before(() => {
    sandbox = sinon.createSandbox()
  });

  beforeEach(() => {
    middlewareStub = sandbox.stub(middleware, "authentication").callsArg(3);
  });

  afterEach(() => {
    sandbox.restore()
  });

  it('should get the data for the gas provider', () => {
    chai.request(server).get('/providers/gas').then((res) => {
      const { status, body } = res;
      expect(status).to.equal(200);
      expect(body).to.be.an('Array');

      const [ billOne ] = body;
      expect(billOne.amount).to.equal(22.27);
      expect(billOne.billedOn).to.equal('2020-04-07T15:03:14.257Z');
    });
  });

  it('should get the data for the internet provider', () => {
    chai.request(server).get('/providers/internet').then((res) => {
      const { status, body } = res;
      expect(status).to.equal(200);
      expect(body).to.be.an('Array');

      const [ billOne ] = body;
      expect(billOne.amount).to.equal(22.27);
      expect(billOne.billedOn).to.equal('2020-04-07T15:03:14.257Z');
    });
  });
});