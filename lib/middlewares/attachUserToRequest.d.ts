import * as express from 'express';
declare const attachUserToRequest: (req: express.Request<import("express-serve-static-core").ParamsDictionary>, _res: express.Response, next: express.NextFunction) => void;
export default attachUserToRequest;
