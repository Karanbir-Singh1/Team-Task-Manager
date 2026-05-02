import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const listTasksSchema = Joi.object({
  body: Joi.object(),
  params: Joi.object(),
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(50),
    projectId: objectId.allow(''),
    status: Joi.string().valid('todo', 'in-progress', 'completed').allow(''),
    priority: Joi.string().valid('low', 'medium', 'high').allow(''),
    search: Joi.string().allow('')
  })
});

export const taskIdSchema = Joi.object({
  body: Joi.object(),
  query: Joi.object(),
  params: Joi.object({ id: objectId.required() })
});

export const createTaskSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(2).max(160).required(),
    description: Joi.string().max(1200).allow(''),
    projectId: objectId.required(),
    assignedTo: objectId.required(),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    status: Joi.string().valid('todo', 'in-progress', 'completed').default('todo'),
    dueDate: Joi.date().required()
  }),
  query: Joi.object(),
  params: Joi.object()
});

export const updateTaskSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(2).max(160),
    description: Joi.string().max(1200).allow(''),
    assignedTo: objectId,
    priority: Joi.string().valid('low', 'medium', 'high'),
    status: Joi.string().valid('todo', 'in-progress', 'completed'),
    dueDate: Joi.date()
  }).min(1),
  query: Joi.object(),
  params: Joi.object({ id: objectId.required() })
});

export const statusSchema = Joi.object({
  body: Joi.object({
    status: Joi.string().valid('todo', 'in-progress', 'completed').required()
  }),
  query: Joi.object(),
  params: Joi.object({ id: objectId.required() })
});
