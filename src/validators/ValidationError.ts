import * as Joi from 'joi';

export class JoiError extends Error {
  response: Joi.ValidationError
  code: number

  constructor (response: Joi.ValidationError, code?: number) {
    super('ValidationError');
    this.name = 'ValidationError';
    this.response = response;
    this.code = code || 400;
  }
}
