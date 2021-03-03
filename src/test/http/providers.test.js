const { app, chai, expect, sinon, } = require('../sandbox');

const middleware = require('../../middleware');

describe('GET /providers', () => {
  before(() =>
    sinon.stub(middleware, "authentication").callsFake((req, res, next) => next())
  );

  it('should get the data for the gas provider', () => {
    chai.request(app).get('/providers/gas').then((res) => {
      const { status, body } = res;
      expect(status).to.equal(200);
      expect(body).to.be.an('Array');

      const [ billOne ] = body;
      expect(billOne.amount).to.equal(22.27);
      expect(billOne.billedOn).to.equal('2020-04-07T15:03:14.257Z');
    });
  });

  it('should get the data for the internet provider', () => {
    chai.request(app).get('/providers/internet').then((res) => {
      const { status, body } = res;
      expect(status).to.equal(200);
      expect(body).to.be.an('Array');

      const [ billOne ] = body;
      expect(billOne.amount).to.equal(22.27);
      expect(billOne.billedOn).to.equal('2020-04-07T15:03:14.257Z');
    });
  });
});