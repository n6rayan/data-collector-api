import AWS from 'aws-sdk';

import config from '../config';
import { logger } from '../logger';

const {
  aws: {
    endpoint,
    region,
    accessKeyId,
    secretAccessKey,
    sqs: {
      queueUrl,
    }
  }
} = config;

const sqs = new AWS.SQS({
  endpoint: endpoint,
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const queueRetry = (body) => {
  return sqs.sendMessage({
    MessageBody: JSON.stringify(body),
    QueueUrl: queueUrl
  }, (err, data) => {
    logger.info(`Request queued for retry with provider '${body.provider}' and callback URL '${body.callbackUrl}'`);
  
    if (err) logger.error(err);
    if (data) logger.info(data);
  });
};

export default queueRetry;