'use strict';
import winston from 'winston';

const { combine, timestamp, json, } = winston.format;

const formatOpts = combine(timestamp(), json());

const transports = [
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    format: formatOpts,
  })
];

export const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports,
});

export const stream = {
  write: (message) => {
    logger.info(message);
  },
};