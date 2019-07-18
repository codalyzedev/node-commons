import * as express from 'express';
import * as config from 'config';

const requireUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.headers['x-secret'] === config.get('SERVER_SECRET')) {
    next();
    return;
  }

  if (!req.currentUser) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }
  
  next();
};

export default requireUser;
