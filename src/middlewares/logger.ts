import * as logger from 'morgan';
import * as express from 'express';
import * as uuidV4 from 'uuid/v4';

type StringArray = string[] | [];

const urlsToDisableLogging: StringArray = [
];

const urlsToDisableBody: StringArray = [
];

const maskSensitiveData = (reqBody: {[key: string]: any}) => {
  const sensitiveFields: StringArray = [];
  const body = Object.assign({}, reqBody);
  for (const field of sensitiveFields) {
    if (body[field]) {
      body[field] = 'xxx';
    }
  }

  return body;
};

logger.token('id', function getId (req: express.Request) {
  return req.id;
});

logger.token('url', (req) => {
  return req.originalUrl;
});

logger.token('body', (req) => {
  try {
    if (req.method === 'GET') {
      return '{}';
    }
  
    for (const url of urlsToDisableBody) {
      if (req.originalUrl.indexOf(url) > -1) {
        return '{}';
      }
    }

    if (req.disableBody === true) {
      return '{}'
    }
  
    return JSON.stringify(maskSensitiveData(req.body));
  } catch (e) {
    return JSON.stringify({
      error: e.message
    });
  }
});

export default (disableLogger: boolean) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.id = req.headers['x-correlation-id'] || uuidV4();

  if (req.method === 'POST') {
    for (const url of urlsToDisableLogging) {
      if (req.originalUrl.indexOf(url) > -1) {
        next();
        return;
      }
    }
  }

  if (!disableLogger) {
    logger('[:date[iso]] :id :remote-addr :method :url :status :response-time :body')(req, res, next);
  } else {
    next();
  }
};
