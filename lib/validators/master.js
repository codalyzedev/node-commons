"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.username = () => Joi.string().alphanum().min(3).max(30);
exports.password = () => Joi.string().alphanum().min(6).max(30);
//# sourceMappingURL=master.js.map