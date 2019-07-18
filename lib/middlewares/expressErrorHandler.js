"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expressErrorHandler = (prefix) => (error, _req, res, _next) => {
    console.log(error);
    if (error.message === 'INVALID_JSON_BODY_PARSER') {
        res.status(400).send('BAD_JSON');
        return;
    }
    if (error.code === 'EBADCSRFTOKEN' && !res.headersSent) {
        res.status(403).send('INVALID_REQUEST_TOKEN');
        return;
    }
    if (error.name === 'ValidationError' && !res.headersSent) {
        res.status(error.code).json(error.response);
        return;
    }
    console.log(prefix, error);
    if (!res.headersSent) {
        res.status(500).send('AN_ERROR_OCCURED');
    }
};
exports.default = expressErrorHandler;
//# sourceMappingURL=expressErrorHandler.js.map