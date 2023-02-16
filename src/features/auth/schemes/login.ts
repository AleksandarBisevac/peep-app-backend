import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(2).max(12).messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 2 characters',
    'string.max': 'Username must be at most 12 characters',
    'string.base': 'Username must be of type string'
  }),
  password: Joi.string().required().min(6).max(16).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password must be at most 16 characters',
    'string.base': 'Password must be of type string'
  })
});

export { loginSchema };
