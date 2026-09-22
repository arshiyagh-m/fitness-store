import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';

export const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({}).sort({ date: -1 });
  res.json(expenses);
});

export const createExpense = asyncHandler(async (req, res) => {
  const { title, category, amount, note } = req.body;
  if (!title || !amount || !category) {
    res.status(400); throw new Error('اطلاعات هزینه ناقص است');
  }

  const expense = await Expense.create({
    title,
    category,
    amount: Number(amount),
    note,
    recordedBy: req.user.name || 'مدیر مالی',
  });

  res.status(201).json(expense);
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (expense) {
    await Expense.deleteOne({ _id: expense._id });
    res.json({ message: 'سند هزینه حذف شد' });
  } else {
    res.status(404); throw new Error('سند هزینه یافت نشد');
  }
});
