const express = require('express');
const morgan = require('morgan');

const middleware = require('./middleware');
const { stream } = require('./logger');

const app = express();
const port = process.env.SERVER_PORT || 3001;

// Request logging
app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms',
      { stream, }
    )
  );

// Middlewares
app.use(middleware.authentication);

// Routes
app.use(require('./routes'));

app.listen(port, () => console.log(`Data Collector API server running at: http://localhost:${port}`));

module.exports = app;