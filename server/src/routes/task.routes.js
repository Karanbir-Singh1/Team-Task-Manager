import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  summary,
  updateStatus,
  updateTask
} from '../controllers/task.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTaskSchema,
  listTasksSchema,
  statusSchema,
  taskIdSchema,
  updateTaskSchema
} from '../validators/task.validator.js';

const router = Router();

router.use(protect);
router.get('/stats/summary', asyncHandler(summary));
router.get('/', validate(listTasksSchema), asyncHandler(listTasks));
router.post('/', authorize('admin'), validate(createTaskSchema), asyncHandler(createTask));
router.get('/:id', validate(taskIdSchema), asyncHandler(getTask));
router.put('/:id', authorize('admin'), validate(updateTaskSchema), asyncHandler(updateTask));
router.patch('/:id/status', validate(statusSchema), asyncHandler(updateStatus));
router.delete('/:id', authorize('admin'), validate(taskIdSchema), asyncHandler(deleteTask));

export default router;
