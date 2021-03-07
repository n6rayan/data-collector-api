const { expect, nock, sinon } = require('../sandbox');

import { FetchError } from 'node-fetch';
import { callbackRequest } from '../../helpers/callbackRequest';
import * as retry from '../../helpers/queueRetry';
import { logger } from '../../logger';

describe('#queueRetry', () => {
  let retrySpy;
  let loggerSpy;

  before(() => {
    retrySpy = sinon.stub(retry, 'queueRetry');
    loggerSpy = sinon.stub(logger, 'error');
  });

  after(() => sinon.restore());

  it('should return a success object', async () => {
    nock('http://some-url.dev').post('/api').reply(200, { success: true });

    const body = { some: 'juicy data' };

    const { status, data, message } = await callbackRequest('http://some-url.dev/api', body);

    expect(status).to.equal(200);
    expect(data).to.equal(body);
    expect(message).to.equal('Success');
  });

  it('should return a failure object', async () => {
    nock('http://some-url.dev').post('/api').reply(500);

    const { status, data, message } = await callbackRequest('http://some-url.dev/api', {
      some: 'juicy data'
    });

    expect(status).to.equal(500);
    expect(data).to.equal(null);
    expect(message).to.match(/Calling the callback URL has failed/);
  });

  it('should queue q retry and log the error', async () => {
    nock('http://some-url.dev').post('/api').reply(500);

    const body = { some: 'juicy data' };
    const url = 'http://some-url.dev/api';

    await callbackRequest(url, body);

    expect(retrySpy).to.be.calledWith({
      data: body,
      callbackUrl: url,
      dataRetrieved: true,
    });

    expect(loggerSpy).to.be.calledWith("invalid json response body at http://some-url.dev/api reason: Unexpected end of JSON input");
  });
});