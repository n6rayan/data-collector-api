import { fetch } from './fetch';
import { logger } from '../logger';
import { queueRetry } from './queueRetry';

export const callbackRequest = (url, data) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then(() => {
      return {
        status: 200,
        data,
        message: 'Success'
      }
    })
    .catch((error) => {
      const retryData = {
        data,
        callbackUrl: url,
        dataRetrieved: true,
      };
      queueRetry(retryData);

      logger.error(error.message);

      return {
        status: 500,
        data: null,
        message: 'Calling the callback URL has failed. The data has been collected and queued for a retry.'
      }
    })
};