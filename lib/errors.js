"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(e) {
        super(e);
        this.name = "VALIDATION_ERROR";
        this.code = 400;
        this.response = e;
    }
}
class Unauthorised extends Error {
    constructor(e) {
        super(e);
        this.name = "UNAUTHORISED";
        this.code = 401;
        this.response = e;
    }
}
exports.default = {
    ValidationError,
    Unauthorised
};
//# sourceMappingURL=errors.js.map