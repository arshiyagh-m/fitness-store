import asyncHandler from 'express-async-handler';
import Setting from '../models/Setting.js';

export const getSettings = asyncHandler(async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create({});
  }
  res.json(setting);
});

export const updateSettings = asyncHandler(async (req, res) => {
  let setting = await Setting.findOne();
  const updates = { ...req.body };
  delete updates._id;
  delete updates.__v;
  delete updates.createdAt;
  delete updates.updatedAt;

  if (!setting) {
    setting = await Setting.create(updates);
  } else {
    Object.assign(setting, updates);
    await setting.save();
  }
  res.json(setting);
});
