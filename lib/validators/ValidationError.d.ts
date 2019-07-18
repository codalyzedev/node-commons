import * as Joi from 'joi';
export declare class JoiError extends Error {
    response: Joi.ValidationError;
    code: number;
    constructor(response: Joi.ValidationError, code?: number);
}
