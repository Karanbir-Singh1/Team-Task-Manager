import { Router } from 'express';
import {
  addMember,
  createProject,
  deleteProject,
  getProject,
  listProjects,
  removeMember,
  updateProject
} from '../controllers/project.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProjectSchema,
  listProjectsSchema,
  memberSchema,
  projectIdSchema,
  removeMemberSchema,
  updateProjectSchema
} from '../validators/project.validator.js';

const router = Router();

router.use(protect);
router.get('/', validate(listProjectsSchema), asyncHandler(listProjects));
router.post('/', authorize('admin'), validate(createProjectSchema), asyncHandler(createProject));
router.get('/:id', validate(projectIdSchema), asyncHandler(getProject));
router.put('/:id', authorize('admin'), validate(updateProjectSchema), asyncHandler(updateProject));
router.delete('/:id', authorize('admin'), validate(projectIdSchema), asyncHandler(deleteProject));
router.post('/:id/members', authorize('admin'), validate(memberSchema), asyncHandler(addMember));
router.delete('/:id/members/:userId', authorize('admin'), validate(removeMemberSchema), asyncHandler(removeMember));

export default router;
