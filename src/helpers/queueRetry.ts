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

export const sqs = new AWS.SQS({
  endpoint: endpoint,
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

export const queueRetry = (body) => {
  return sqs.sendMessage({
    MessageBody: JSON.stringify(body),
    QueueUrl: queueUrl
  }, (err, data) => {
    /* istanbul ignore next */
    logger.info('Request queued for retry.', body);
  
    /* istanbul ignore next */
    if (err) logger.error(err);
    /* istanbul ignore next */
    if (data) logger.info(data);
  });
};