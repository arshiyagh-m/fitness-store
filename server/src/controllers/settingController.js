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
  if (!setting) {
    setting = await Setting.create(req.body);
  } else {
    Object.assign(setting, req.body);
    await setting.save();
  }
  res.json(setting);
});
