"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.trailRates = () => Joi.object().keys({
    rates: Joi.array().items(Joi.object().keys({
        month: Joi.number(), rate: Joi.number(), isPerpetual: Joi.boolean()
    }))
});
//# sourceMappingURL=memos.js.map