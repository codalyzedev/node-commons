import * as express from 'express';
declare const requireUser: (req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, next: express.NextFunction) => void;
export default requireUser;
