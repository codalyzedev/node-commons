import * as Joi from 'joi';

export const username = () => Joi.string().alphanum().min(3).max(30);
export const password = () => Joi.string().alphanum().min(6).max(30);
