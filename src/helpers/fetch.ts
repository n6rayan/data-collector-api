import nodeFetch from 'node-fetch';

import { logger } from '../logger';

const fetch = (url, options = {}) => {
  logger.info(`Making request to ${url}`, {
    ...options
  });
  return nodeFetch(url, options).then((res) => {
    logger.info(`Response received from ${url}`, {
      status: res.status,
    });

    return res;
  });
};
export default fetch;