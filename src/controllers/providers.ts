import schema from './schema';
import fetch from '../helpers/fetch';
import queueRetry from '../helpers/queueRetry';
import config from '../config';
import { logger } from '../logger';

const { providerApi: { url } } = config;

export const postProvider = async (req, res) => {
  const { body } = req;

  try {
    const validationResult = await schema.validateAsync(body, { abortEarly: false });
    logger.info(validationResult);
  }
  catch(err) {
    logger.error(err);

    return res.json({ errors: err.details });
  }

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
      queueRetry(req.body);

      logger.error(error);

      return res.status(500).json({
        error: `The provider '${provider}' is having a temporary outage. Your request has been queued for a retry.`
      });
    });
};