import schema from './schema';
import fetch from '../helpers/fetch';
import queueRetry from '../helpers/queueRetry';
import callbackRequest from '../helpers/callbackRequest';
import config from '../config';
import { logger } from '../logger';

const { providerApi: { url } } = config;

export const postProvider = async (request, response) => {
  const { body } = request;

  try {
    const validationResult = await schema.validateAsync(body, { abortEarly: false });
    logger.info(validationResult);
  }
  catch (err) {
    logger.error(err);

    return response.json({ errors: err.details });
  }

  const { provider, callbackUrl, dataRetrieved, data } = request.body;

  if (dataRetrieved) {
    return callbackRequest(callbackUrl, data)
      .then(({ status, data, message }) => {
        return response.status(status).json({ data, message });
      });
  }

  return fetch(`${url}/providers/${provider}`)
    .then((res) => res.json())
    .then((json) => {
      logger.info('Response body received.', json);

      callbackRequest(callbackUrl, json)
        .then(({ status, data, message }) => {
          return response.status(status).json({ data, message });
        });
    })
    .catch((error) => {
      const retryData = {
        ...request.body,
        dataRetrieved: false,
      };

      queueRetry(retryData);

      logger.error(error);

      return response.status(500).json({
        error: `The provider '${provider}' is having a temporary outage. Your request has been queued for a retry.`
      });
    });
};