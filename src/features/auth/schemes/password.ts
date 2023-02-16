import Joi, { ObjectSchema } from 'joi';

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(6).max(16).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password must be at most 16 characters',
    'string.base': 'Password must be of type string'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords must match',
    'any.required': 'Confirm password is required'
  })
});

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be of type string',
    'string.required': 'Email is required',
    'string.email': 'Email must be a valid email'
  })
});

export { passwordSchema, emailSchema };
