"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
function default_1(req, res, next) {
    bodyParser.json()(req, res, err => {
        if (err instanceof Error)
            next(new Error('INVALID_JSON_BODY_PARSER'));
        else
            next();
    });
}
exports.default = default_1;
;
//# sourceMappingURL=jsonBodyParser.js.map