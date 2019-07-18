"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JoiError extends Error {
    constructor(response, code) {
        super('ValidationError');
        this.name = 'ValidationError';
        this.response = response;
        this.code = code || 400;
    }
}
exports.JoiError = JoiError;
//# sourceMappingURL=ValidationError.js.map