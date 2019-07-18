import * as express from 'express';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as http from 'http';

import {jsonBodyParser, logger, expressErrorHandler} from './middlewares';

interface IHttpServerOptions {
  disableLogger: boolean;
  disableBodyParser: boolean;
}

const defaultHttpServerOptions: IHttpServerOptions = {
  disableLogger: false,
  disableBodyParser: false
};

const createHttpServer = (
  serverName: string,
  middlewares: express.RequestHandler[] = [],
  options: IHttpServerOptions = defaultHttpServerOptions
) => {
  const app = express();
  app.use(logger(options.disableLogger));
  app.use(helmet({frameguard: {action: 'deny'}}));

  if (!options.disableBodyParser) {
    app.use(jsonBodyParser);
  }

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.get('/health-check', (_req, res) => res.status(200).send('healthy'));

  middlewares.forEach(mw => {
    app.use(mw);
  });

  app.use(expressErrorHandler(serverName));

  const server = http.createServer(app);
  
  return server;
};

export default createHttpServer;
