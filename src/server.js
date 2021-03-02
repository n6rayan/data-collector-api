const express = require('express');
const morgan = require('morgan');

const { randomFailuresMiddleware } = require('./middlewares');
const logger = require('./logger');

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Request logging
app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms',
      { stream: logger.stream, }
    )
  );

// Middlewares
app.use(randomFailuresMiddleware);

// Routes
app.use(require('./routes'));

app.listen(port, () => console.log(`Providers server listening at http://localhost:${port}`));