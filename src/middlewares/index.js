const FAILURE_PROBABILITY = 0.5;

module.exports.randomFailuresMiddleware = (_, res, next) => {
  if (Math.random() > 1 - FAILURE_PROBABILITY) {
      res.setHeader('Content-Type', 'text/plain');
      res.writeHead(500, res.headers);
      return res.end('#fail');
  }
  
  next();
}