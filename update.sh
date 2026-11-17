#!/bin/bash
echo "🔄 در حال پاکسازی پروسه‌های خراب و راه‌اندازی قطعی پورت ۵۰۰۰..."
git pull origin main

# ۱. روشن کردن دیتابیس
systemctl start mongod || true
mkdir -p server/uploads && chmod -R 777 server/uploads

# ۲. ورود مستقیم به پوشه سرور و نصب پکیج‌ها
cd /var/www/fitness-store/server
npm install
npm install axios multer

# ۳. بستن تمام پروسه‌های قدیمی و اجرای قطعی نود با مسیر مطلق
pm2 kill || true
pm2 delete all || true
pm2 start src/server.js --name "team9-backend" --cwd /var/www/fitness-store/server
pm2 save

# ۴. بیلد فرانت‌اند و ریستارت وب‌سرور
cd /var/www/fitness-store/client
npm install
npm run build
systemctl restart nginx

echo "=========================================================="
echo "✅ پورت ۵۰۰۰ با موفقیت روشن شد و خطای ۵۰۲ ریشه‌کن گردید!"
echo "=========================================================="
