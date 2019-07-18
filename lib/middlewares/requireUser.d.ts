import * as express from 'express';
declare const requireUser: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
export default requireUser;
