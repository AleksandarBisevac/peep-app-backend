import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email',
    'string.base': 'Email must be of type string'
  }),
  password: Joi.string().required().min(6).max(16).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password must be at most 16 characters',
    'string.base': 'Password must be of type string'
  })
});

export { loginSchema };
