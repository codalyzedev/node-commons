"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
});
exports.default = logger;
//# sourceMappingURL=debug.js.map