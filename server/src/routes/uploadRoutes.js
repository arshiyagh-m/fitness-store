import path from 'path';
import fs from 'fs';
import express from 'express';
import multer from 'multer';

const router = express.Router();
const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `prod-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('تنها تصاویر (jpg, png, webp) مجاز هستند'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // تا ۱۰ مگابایت برای هر عکس
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// آپلود تکی
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'فایلی انتخاب نشده است' });
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

// آپلود همزمان چند عکس (Multi-Upload) مستقیم از سیستم
router.post('/multiple', upload.array('images', 8), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'هیچ فایلی انتخاب نشده است' });
  }
  const filePaths = req.files.map(f => `/${f.path.replace(/\\/g, '/')}`);
  res.json(filePaths);
});

export default router;
