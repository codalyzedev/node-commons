"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.checkBigserial = () => Joi.number();
exports.checkNumber = () => Joi.number();
exports.validateISODate = () => Joi.date().iso();
//# sourceMappingURL=global.js.map