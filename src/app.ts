import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import { authentication } from './middleware';
import { stream } from './logger';
import routes from './routes';

const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(bodyParser.json());

// Request logging
app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms',
      { stream, }
    )
  );

// Middlewares
app.use(authentication);

// Routes
app.use(routes);

app.listen(port, () => console.log(`Data Collector API server running at: http://localhost:${port}`));

export default app;