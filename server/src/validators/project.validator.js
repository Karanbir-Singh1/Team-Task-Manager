import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const listProjectsSchema = Joi.object({
  body: Joi.object(),
  params: Joi.object(),
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(50),
    search: Joi.string().allow('')
  })
});

export const projectIdSchema = Joi.object({
  body: Joi.object(),
  query: Joi.object(),
  params: Joi.object({ id: objectId.required() })
});

export const createProjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(120).required(),
    description: Joi.string().max(1000).allow(''),
    deadline: Joi.date().required(),
    members: Joi.array().items(objectId).default([])
  }),
  query: Joi.object(),
  params: Joi.object()
});

export const updateProjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(120),
    description: Joi.string().max(1000).allow(''),
    deadline: Joi.date(),
    members: Joi.array().items(objectId)
  }).min(1),
  query: Joi.object(),
  params: Joi.object({ id: objectId.required() })
});

export const memberSchema = Joi.object({
  body: Joi.object({ userId: objectId.required() }),
  query: Joi.object(),
  params: Joi.object({ id: objectId.required() })
});

export const removeMemberSchema = Joi.object({
  body: Joi.object(),
  query: Joi.object(),
  params: Joi.object({ id: objectId.required(), userId: objectId.required() })
});
