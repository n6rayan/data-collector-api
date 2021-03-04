import fetch from '../helpers/fetch';
import config from '../config';
import { logger } from '../logger';

const { url } = config.providerApi;

export const postProvider = (req, res) => {
  const { provider, callback } = req.body;

  return fetch(`${url}/providers/${provider}`)
    .then((res) => res.json())
    .then((json) => {
      logger.info('Response body received:', json);

      return res.json(json);
    })
    .catch((e) => {
      // IMPLEMENT RETRY LOGIC
      logger.error(e);

      return res.status(500).json({
        error: `The provider '${provider}' is having a temporary outage. Your request has been queued for a retry.`
      });
    });
};