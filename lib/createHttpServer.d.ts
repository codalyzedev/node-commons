/// <reference types="node" />
import * as express from 'express';
import * as http from 'http';
interface IHttpServerOptions {
    disableLogger: boolean;
    disableBodyParser: boolean;
}
declare const createHttpServer: (serverName: string, middlewares?: express.RequestHandler<import("express-serve-static-core").ParamsDictionary>[], options?: IHttpServerOptions) => http.Server;
export default createHttpServer;
