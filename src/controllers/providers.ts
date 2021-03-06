import AWS from 'aws-sdk';
import fetch from '../helpers/fetch';
import config from '../config';
import { logger } from '../logger';

const { providerApi: { url }, aws } = config;

const sqs = new AWS.SQS({
  endpoint: aws.endpoint,
  region: aws.region,
  accessKeyId: aws.accessKeyId,
  secretAccessKey: aws.secretAccessKey,
});

export const postProvider = (req, res) => {
  const { provider, callbackUrl } = req.body;

  return fetch(`${url}/providers/${provider}`)
    .then((res) => res.json())
    .then((json) => {
      logger.info('Response body received:', json);

      fetch(callbackUrl, {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return res.status(200).json(json);
    })
    .catch((error) => {
      sqs.sendMessage({
        MessageBody: JSON.stringify(req.body),
        QueueUrl: aws.sqs.queueUrl
      }, (err, data) => {
        logger.info(`Request queued for retry with provider '${req.body.provider}' and callback URL '${req.body.callbackUrl}'`);

        if (err) logger.error(err);
        if (data) logger.info(data);
      });

      logger.error(error);

      return res.status(500).json({
        error: `The provider '${provider}' is having a temporary outage. Your request has been queued for a retry.`
      });
    });
};