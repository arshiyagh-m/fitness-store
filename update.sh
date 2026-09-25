#!/bin/bash
echo "🔄 در حال بروزرسانی سرور از گیت‌هاب..."
git pull origin main
mkdir -p server/uploads && chmod -R 777 server/uploads
cd server && npm install && npm install axios multer
pm2 restart team9-backend || pm2 start src/server.js --name "team9-backend"
cd ../client && npm install && npm run build
systemctl restart nginx
echo "=========================================================="
echo "✅ تمام تغییرات جدید با موفقیت روی سرور اعمال شد!"
echo "سایت را باز کنید: https://team9.ir"
echo "=========================================================="
