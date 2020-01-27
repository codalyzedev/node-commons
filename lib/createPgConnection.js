"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise = require("bluebird");
const pgPromise = require("pg-promise");
exports.default = (databaseUrl, disableMonitor) => {
    const initOptions = {
        promiseLib: promise,
        error(error) {
            return Object.assign(Object.assign({}, error), { DB_ERROR: true });
        }
    };
    if (!disableMonitor) {
    }
    const pgp = pgPromise(initOptions);
    const db = pgp(databaseUrl);
    return db;
};
//# sourceMappingURL=createPgConnection.js.map