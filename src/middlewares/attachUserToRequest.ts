import * as express from 'express';

const attachUserToRequest = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
  const userString : any = req.headers['x-user'];

  if (!userString) {
    next();
    return;
  }

  try {
    const user = JSON.parse(userString as string);
    req.currentUser = user;
    next();
    return;
  } catch (e) {
    next();
    return;
  }
};

export default attachUserToRequest;
