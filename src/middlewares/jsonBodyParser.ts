import * as express from 'express';
import * as bodyParser from 'body-parser';

export default function (req: express.Request, res: express.Response, next: express.NextFunction) {
  bodyParser.json()(req, res, err => {
    if (err instanceof Error) next(new Error('INVALID_JSON_BODY_PARSER'));
    else next();
  });
};
