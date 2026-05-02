import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { getPagination, pagedResponse } from '../utils/pagination.js';

const projectVisibility = (user) =>
  user.role === 'admin' ? { admin: user._id } : { members: user._id };

export const listProjects = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { ...projectVisibility(req.user) };

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const [items, total] = await Promise.all([
    Project.find(filter)
      .populate('members', 'name email role')
      .populate('admin', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filter)
  ]);

  res.json(pagedResponse(items, total, page, limit));
};

export const createProject = async (req, res) => {
  const members = [...new Set([...(req.body.members || []), req.user._id.toString()])];
  const project = await Project.create({ ...req.body, members, admin: req.user._id });
  res.status(201).json(await project.populate('members', 'name email role'));
};

export const getProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, ...projectVisibility(req.user) })
    .populate('members', 'name email role')
    .populate('admin', 'name email role');

  if (!project) throw new ApiError(404, 'Project not found');
  res.json(project);
};

export const updateProject = async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, admin: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('members', 'name email role');

  if (!project) throw new ApiError(404, 'Project not found');
  res.json(project);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, admin: req.user._id });
  if (!project) throw new ApiError(404, 'Project not found');

  await Task.deleteMany({ projectId: project._id });
  res.json({ message: 'Project and related tasks deleted' });
};

export const addMember = async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user) throw new ApiError(404, 'User not found');

  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, admin: req.user._id },
    { $addToSet: { members: user._id } },
    { new: true }
  ).populate('members', 'name email role');

  if (!project) throw new ApiError(404, 'Project not found');
  res.json(project);
};

export const removeMember = async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, admin: req.user._id },
    { $pull: { members: req.params.userId } },
    { new: true }
  ).populate('members', 'name email role');

  if (!project) throw new ApiError(404, 'Project not found');
  await Task.updateMany({ projectId: project._id, assignedTo: req.params.userId }, { assignedTo: req.user._id });
  res.json(project);
};
