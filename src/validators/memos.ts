import * as Joi from 'joi';

export const trailRates = () => Joi.object().keys(
    {
      rates: Joi.array().items(
        Joi.object().keys(
          {
            month: Joi.number(), rate: Joi.number(), isPerpetual: Joi.boolean()
          }
        )
      )
    }
  );
