import asyncHandler from 'express-async-handler';
import Setting from '../models/Setting.js';
export const getSettings = asyncHandler(async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) setting = await Setting.create({});
  res.json(setting);
});
export const updateSettings = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates._id; delete updates.__v; delete updates.createdAt; delete updates.updatedAt;
  const setting = await Setting.findOneAndUpdate({}, { $set: updates }, { new: true, upsert: true });
  res.json(setting);
});
