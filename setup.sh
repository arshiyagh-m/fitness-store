#!/bin/bash
apt update && apt upgrade -y
apt install -y git curl wget ufw build-essential nginx certbot python3-certbot-nginx bind9 bind9utils

mkdir -p /etc/bind/zones
cat << 'EOC' > /etc/bind/named.conf.local
zone "team9.ir" { type master; file "/etc/bind/zones/db.team9.ir"; };
EOC

cat << 'EOC' > /etc/bind/zones/db.team9.ir
$TTL 604800
@ IN SOA ns1.team9.ir. admin.team9.ir. ( 3 604800 86400 2419200 604800 )
@ IN NS ns1.team9.ir.
@ IN NS ns2.team9.ir.
ns1 IN A 185.213.165.65
ns2 IN A 185.213.165.65
@ IN A 185.213.165.65
www IN A 185.213.165.65
EOC

systemctl restart bind9 && systemctl enable bind9

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs && npm install -g pm2

curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update && apt install -y mongodb-org
systemctl start mongod && systemctl enable mongod

mkdir -p /var/www && cd /var/www && rm -rf fitness-store
git clone https://github.com/arshiyagh-m/fitness-store.git && cd fitness-store

cd /var/www/fitness-store/client && npm install && npm run build
cd /var/www/fitness-store/server && npm install && npm install axios multer

cat << 'EOC' > .env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://127.0.0.1:27017/fitness_store
JWT_SECRET=Team9_National_Enterprise_Super_Secret_2025!
EOC

node src/resetAdmin.js

pm2 delete team9-backend 2>/dev/null || true
pm2 start src/server.js --name "team9-backend"
pm2 save && pm2 startup

cat << 'EOC' > /etc/nginx/sites-available/team9
server {
    listen 80;
    server_name team9.ir www.team9.ir 185.213.165.65;
    root /var/www/fitness-store/client/dist;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    location /api { proxy_pass http://127.0.0.1:5000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection 'upgrade'; proxy_set_header Host $host; proxy_cache_bypass $http_upgrade; }
    location /uploads { proxy_pass http://127.0.0.1:5000; proxy_set_header Host $host; }
    client_max_body_size 25M;
}
EOC

ln -s /etc/nginx/sites-available/team9 /etc/nginx/sites-enabled/ 2>/dev/null || true
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

ufw allow 22/tcp
ufw allow 3031/tcp
ufw allow 'Nginx Full'
ufw allow 53
ufw --force enable

echo "=========================================================="
echo "🎉 DEPLOY_FINISHED_SUCCESSFULLY!"
echo "http://185.213.165.65"
echo "=========================================================="
