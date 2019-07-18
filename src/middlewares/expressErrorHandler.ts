import * as express from 'express';

const expressErrorHandler = (prefix: string) => (error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.log(error);
  if (error.message === 'INVALID_JSON_BODY_PARSER') {
    res.status(400).send('BAD_JSON');
    return;
  }

  if (error.code === 'EBADCSRFTOKEN' && !res.headersSent) {
    res.status(403).send('INVALID_REQUEST_TOKEN');
    return;
  }

  if (error.name === 'ValidationError' && !res.headersSent) {
    res.status(error.code).json(error.response);
    return;
  }

  // const query = error.query ? error.query.toString() : null;
  // const code = error.code || null;
  // const source = error.DB_ERROR ? `${prefix}_DB_ERROR` : `${prefix}_API_ERROR`;

  // const message = JSON.stringify({
  //   message: error.message,
  //   url: req.url,
  //   method: req.method
  // });

  // db.logs.logError(message, error.stack, req.id, req.currentUser && req.currentUser.id, source, query, code);

  console.log(prefix, error);

  if (!res.headersSent) {
    res.status(500).send('AN_ERROR_OCCURED');
  }
};

export default expressErrorHandler;
