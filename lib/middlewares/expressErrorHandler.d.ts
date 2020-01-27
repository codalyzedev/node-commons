import * as express from 'express';
declare const expressErrorHandler: (prefix: string) => (error: any, _req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response, _next: express.NextFunction) => void;
export default expressErrorHandler;
