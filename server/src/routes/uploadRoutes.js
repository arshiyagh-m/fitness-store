import path from 'path';
import fs from 'fs';
import express from 'express';
import multer from 'multer';

const router = express.Router();
const uploadDir = 'uploads/';

// اگر پوشه وجود نداشت، خودکار بساز با دسترسی کامل
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
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
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'فایلی انتخاب نشده است' });
  }
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

export default router;
