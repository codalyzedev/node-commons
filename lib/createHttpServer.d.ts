/// <reference types="node" />
import * as express from 'express';
import * as http from 'http';
interface IHttpServerOptions {
    disableLogger: boolean;
    disableBodyParser: boolean;
}
declare const createHttpServer: (serverName: string, middlewares?: express.RequestHandler[], options?: IHttpServerOptions) => http.Server;
export default createHttpServer;
