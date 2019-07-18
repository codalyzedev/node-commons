import * as express from 'express';
declare const attachUserToRequest: (req: express.Request, _res: express.Response, next: express.NextFunction) => void;
export default attachUserToRequest;
