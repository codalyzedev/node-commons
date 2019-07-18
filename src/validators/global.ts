import * as Joi from 'joi';

export const checkBigserial = () => Joi.number();
export const checkNumber = () => Joi.number();
export const validateISODate = () => Joi.date().iso();
