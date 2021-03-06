import Joi from 'joi';

export default Joi.object().required().keys({
  provider: Joi.string().required().messages({
    'string.empty': 'You must specify a provider',
  }),
  callbackUrl: Joi.string().uri().required().messages({
    'string.empty': 'You must specify a callback URL',
  }),
})