import Joi from 'joi';

export const signupSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('admin', 'member').default('member')
  }),
  query: Joi.object(),
  params: Joi.object()
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  query: Joi.object(),
  params: Joi.object()
});
