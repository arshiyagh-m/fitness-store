import asyncHandler from 'express-async-handler';
import Question from '../models/Question.js';
import Product from '../models/Product.js';

// ثبت سوال جدید توسط کاربر
export const createQuestion = asyncHandler(async (req, res) => {
  const { productId, question } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404); throw new Error('محصول یافت نشد');
  }

  const newQuestion = await Question.create({
    user: req.user._id,
    product: productId,
    authorName: req.user.name,
    productTitle: product.title,
    question,
  });

  res.status(201).json(newQuestion);
});

// دریافت سوالات تایید و پاسخ داده شده برای یک محصول خاص
export const getProductQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({ product: req.params.productId }).sort({ createdAt: -1 });
  res.json(questions);
});

// دریافت تمام سوالات برای پنل ادمین
export const getAllQuestionsAdmin = asyncHandler(async (req, res) => {
  const questions = await Question.find({}).sort({ createdAt: -1 });
  res.json(questions);
});

// پاسخ دادن به سوال توسط ادمین / مربی
export const answerQuestion = asyncHandler(async (req, res) => {
  const { answer, answeredBy } = req.body;
  const question = await Question.findById(req.params.id);

  if (question) {
    question.answer = answer;
    question.answeredBy = answeredBy || 'مربی رسمی Team 9';
    question.isAnswered = true;
    const updated = await question.save();
    res.json(updated);
  } else {
    res.status(404); throw new Error('پرسش یافت نشد');
  }
});

// حذف سوال توسط ادمین
export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (question) {
    await Question.deleteOne({ _id: question._id });
    res.json({ message: 'سوال با موفقیت حذف شد' });
  } else {
    res.status(404); throw new Error('پرسش یافت نشد');
  }
});
