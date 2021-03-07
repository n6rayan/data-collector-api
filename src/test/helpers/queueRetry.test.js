const { expect, sinon } = require('../sandbox');

import { queueRetry, sqs } from '../../helpers/queueRetry';

describe('#queueRetry', () => {
  it('should call sqs send message with message body', () => {
    const awsSpy = sinon.stub(sqs, 'sendMessage');
    const body = { some: 'juicy data' };

    queueRetry(body);

    expect(awsSpy).to.be.calledWith({
      MessageBody: JSON.stringify(body),
      QueueUrl: 'http://localstack:4566/000000000000/retry-queue'
    });
  });
});