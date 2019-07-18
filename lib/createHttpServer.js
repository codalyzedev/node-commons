"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const middlewares_1 = require("./middlewares");
const defaultHttpServerOptions = {
    disableLogger: false,
    disableBodyParser: false
};
const createHttpServer = (serverName, middlewares = [], options = defaultHttpServerOptions) => {
    const app = express();
    app.use(middlewares_1.logger(options.disableLogger));
    app.use(helmet({ frameguard: { action: 'deny' } }));
    if (!options.disableBodyParser) {
        app.use(middlewares_1.jsonBodyParser);
    }
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.get('/health-check', (_req, res) => res.status(200).send('healthy'));
    middlewares.forEach(mw => {
        app.use(mw);
    });
    app.use(middlewares_1.expressErrorHandler(serverName));
    const server = http.createServer(app);
    return server;
};
exports.default = createHttpServer;
//# sourceMappingURL=createHttpServer.js.map