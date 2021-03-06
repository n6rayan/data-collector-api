import Joi from 'joi';

export default Joi.object().keys({
  provider: Joi.string().when('dataRetrieved', {
    is: false,
    then: Joi.string().required(),
  }),
  callbackUrl: Joi.string().uri().required(),
  dataRetrieved: Joi.bool().default(false),
  data: Joi.array().when('dataRetrieved', {
    is: true,
    then: Joi.array().required().items(
      Joi.object().required().keys({
        billedOn: Joi.string().required(),
        amount: Joi.number().required(),
      })
    ),
  })
});