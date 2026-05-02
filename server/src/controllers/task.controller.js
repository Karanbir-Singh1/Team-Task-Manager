import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';
import { getPagination, pagedResponse } from '../utils/pagination.js';

const visibleProjectFilter = (user) =>
  user.role === 'admin' ? { admin: user._id } : { members: user._id };

const ensureProjectAccess = async (projectId, user, adminOnly = false) => {
  const filter = adminOnly ? { _id: projectId, admin: user._id } : { _id: projectId, ...visibleProjectFilter(user) };
  const project = await Project.findOne(filter);
  if (!project) throw new ApiError(404, 'Project not found');
  return project;
};

export const listTasks = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const projectFilter = visibleProjectFilter(req.user);
  const visibleProjects = await Project.find(projectFilter).select('_id');
  const projectIds = visibleProjects.map((project) => project._id);

  const filter = { projectId: { $in: projectIds } };
  if (req.user.role === 'member') filter.assignedTo = req.user._id;
  if (req.query.projectId) filter.projectId = req.query.projectId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.search) filter.$text = { $search: req.query.search };

  const [items, total] = await Promise.all([
    Task.find(filter)
      .populate('projectId', 'name deadline')
      .populate('assignedTo', 'name email role')
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter)
  ]);

  res.json(pagedResponse(items, total, page, limit));
};

export const createTask = async (req, res) => {
  const project = await ensureProjectAccess(req.body.projectId, req.user, true);
  if (!project.members.map(String).includes(req.body.assignedTo)) {
    throw new ApiError(400, 'Assigned user must be a project member');
  }

  const task = await Task.create(req.body);
  res.status(201).json(await task.populate(['projectId', 'assignedTo']));
};

export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id).populate('projectId').populate('assignedTo', 'name email role');
  if (!task) throw new ApiError(404, 'Task not found');

  await ensureProjectAccess(task.projectId._id, req.user);
  if (req.user.role === 'member' && task.assignedTo._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Members can only view assigned tasks');
  }

  res.json(task);
};

export const updateTask = async (req, res) => {
  const existing = await Task.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Task not found');
  await ensureProjectAccess(existing.projectId, req.user, true);

  if (req.body.assignedTo) {
    const project = await Project.findById(existing.projectId);
    if (!project.members.map(String).includes(req.body.assignedTo)) {
      throw new ApiError(400, 'Assigned user must be a project member');
    }
  }

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('projectId', 'name deadline')
    .populate('assignedTo', 'name email role');

  res.json(task);
};

export const updateStatus = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  const isAssignedMember = task.assignedTo.toString() === req.user._id.toString();
  if (req.user.role !== 'admin' && !isAssignedMember) {
    throw new ApiError(403, 'You can only update your assigned task status');
  }

  if (req.user.role === 'admin') await ensureProjectAccess(task.projectId, req.user, true);
  task.status = req.body.status;
  await task.save();
  res.json(await task.populate(['projectId', 'assignedTo']));
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  await ensureProjectAccess(task.projectId, req.user, true);
  await task.deleteOne();
  res.json({ message: 'Task deleted' });
};

export const summary = async (req, res) => {
  const visibleProjects = await Project.find(visibleProjectFilter(req.user)).select('_id');
  const projectIds = visibleProjects.map((project) => project._id);
  const filter = { projectId: { $in: projectIds } };
  if (req.user.role === 'member') filter.assignedTo = req.user._id;

  const now = new Date();
  const [byStatus, overdue] = await Promise.all([
    Task.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Task.countDocuments({ ...filter, status: { $ne: 'completed' }, dueDate: { $lt: now } })
  ]);

  const statusMap = Object.fromEntries(byStatus.map((item) => [item._id, item.count]));
  res.json({
    total: byStatus.reduce((sum, item) => sum + item.count, 0),
    todo: statusMap.todo || 0,
    inProgress: statusMap['in-progress'] || 0,
    completed: statusMap.completed || 0,
    overdue,
    projectCount: projectIds.length
  });
};
