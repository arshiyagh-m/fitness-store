#!/bin/bash
echo "🔄 در حال بروزرسانی سرور و بازیابی اطلاعات شما..."
git pull origin main

systemctl start mongod || true
mkdir -p server/uploads && chmod -R 777 server/uploads

cd /var/www/fitness-store/server
npm install
npm install axios multer

# اجرای اسکریپت بازیابی اکانت ادمین
node src/restoreMyData.js

pm2 kill || true
pm2 delete all || true
pm2 start src/server.js --name "team9-backend" --cwd /var/www/fitness-store/server
pm2 save

cd /var/www/fitness-store/client
npm install
npm run build
systemctl restart nginx

echo "=========================================================="
echo "✅ سرور بروز شد و اکانت ادمین شما ساخته شد!"
echo "سایت را باز کنید: https://team9.ir"
echo "=========================================================="
