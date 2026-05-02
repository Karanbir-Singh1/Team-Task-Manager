import User from '../models/User.js';

export const listUsers = async (_req, res) => {
  const users = await User.find().select('name email role').sort({ name: 1 });
  res.json(users);
};
