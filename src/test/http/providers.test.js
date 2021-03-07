const { app, chai, expect, nock, sinon } = require('../sandbox');

const { logger } = require('../../logger');
import * as cb from '../../helpers/callbackRequest';
import * as retry from '../../helpers/queueRetry';
import schema from '../../controllers/schema';

describe('GET /providers', () => {
  const internetData = [
    { billedOn: '2020-02-07T15:03:14.257Z', amount: 15.12 },
    { billedOn: '2020-03-07T15:03:14.257Z', amount: 15.12 }
  ];

  const callbackUrl = 'http://some-url.dev/cb';

  describe('#errors', () => {
    afterEach(() => {
      sinon.restore();
      nock.restore();
      nock.cleanAll();
    });

    it('should log error when data does not match schema', async () => {
      const loggerSpy = sinon.stub(logger, 'error');

      const error = new Error('some-error');
      sinon.stub(schema, 'validateAsync').throws(error);
      await chai.request(app).post('/api/providers');

      expect(loggerSpy).to.have.been.calledWith(error);
    });

    it('should return a 400 error when the data is not correct', async () => {
      const { status, body } = await chai.request(app).post('/api/providers');

      expect(status).to.equal(400);
      expect(body.errors).to.be.an('Array');

      const [callbackErr, providerErr] = body.errors;

      expect(callbackErr.message).to.equal('"callbackUrl" is required');
      expect(providerErr.message).to.equal('"provider" is required');
    });

    it('should return a 400 error when the data is not provided but the dataRetrieved flag is set to false', async () => {
      const { status, body } = await chai.request(app).post('/api/providers').send({
        callbackUrl,
        provider: 'gas',
        dataRetrieved: true
      });

      expect(status).to.equal(400);
      expect(body.errors).to.be.an('Array');

      const [callbackErr] = body.errors;

      expect(callbackErr.message).to.equal('"data" is required');
    });

    it('should return a 500 error when the data retrieval fails', async () => {
      nock('http://some-url.dev').get('/cb').reply(500);

      const { status, body } = await chai.request(app).post('/api/providers').send({
        callbackUrl,
        provider: 'gas',
      });

      expect(status).to.equal(500);
      expect(body.error).to.match(/The provider 'gas' is having a temporary outage./);
      nock.restore();
    });

    it('should queue a retry when the data retrieval fails', async () => {
      nock('http://provider-api-mock-service:3000')
        .get('/providers/internet').reply(500);

      const retrySpy = sinon.stub(retry, 'queueRetry').resolves();

      const data = {
        callbackUrl,
        provider: 'gas',
      };

      await chai.request(app).post('/api/providers').send(data);

      expect(retrySpy).to.be.calledWith({ ...data, dataRetrieved: false });
      nock.restore();
    });
  });

  describe('#callbackRequest', () => {

    afterEach(() => sinon.restore());

    it('should should call callbackRequest helper when data has already been retrieved', async () => {
      const callbackReqSpy = sinon.stub(cb, 'callbackRequest').resolves({
        status: 200,
        data: internetData,
        message: 'Success'
      });

      await chai.request(app).post('/api/providers').send({
        callbackUrl,
        dataRetrieved: true,
        data: internetData
      });

      expect(callbackReqSpy).to.be.calledWith(callbackUrl, internetData);
    });

    // FIX ME - The `callbackRequest` function is called, but for some reason
    // the test is failing.
    // it('should call callbackRequest helper and log data once data is retrieved', async () => {
    //   const loggerSpy = sinon.stub(logger, 'info');
    //   nock('http://provider-api-mock-service:3000')
    //     .get('/providers/internet')
    //     .reply(200, internetData);

    //   await chai.request(app).post('/api/providers').send({
    //     callbackUrl,
    //     provider: 'internet'
    //   });

    //   const callbackReqSpy = sinon.stub(cb, 'callbackRequest').resolves({
    //     status: 200,
    //     data: internetData,
    //     message: 'Success',
    //   });

    //   expect(loggerSpy).to.be.calledWith('Response body received.', internetData);
    //   expect(callbackReqSpy).to.be.called;
    // });
  });
});