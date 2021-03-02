'use strict';
const winston = require('winston');

const { combine, timestamp, json, } = winston.format;

const formatOpts = combine(timestamp(), json());

const transports = [
  new winston.transports.Console({
    level: 'info',
    format: formatOpts,
  })
];

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  colorize: true,
  transports,
});

logger.stream = {
  write: (message) => logger.info(message),
};

module.exports = logger;