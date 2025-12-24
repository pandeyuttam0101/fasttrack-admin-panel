🚀 FastTrack Admin Panel (Node.js + MongoDB + Admin Dashboard)

This project is a full admin panel system built with Node.js, Express, MongoDB, Sessions, and a Tailwind CSS frontend.
It includes Admin Login, Protected Dashboard, Auto Logout, Charts, Search, and Live Deployment.

📁 Project Folder Structure
fasttrack/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env              (local only ❌ do not upload)
│   └── node_modules/     (auto-generated)
│
├── frontend/
│   ├── admin-login.html
│   ├── admin.html
│   ├── js/
│   │   └── admin.js
│
├── .gitignore
└── README.md

✅ STEP-1: Prerequisites (Install First)

Make sure these are installed on your system:

✅ Node.js (v18+)

node -v


✅ npm

npm -v


✅ Git

git --version

✅ STEP-2: Clone or Download Project
Option A: Clone from GitHub
git clone https://github.com/YOUR_USERNAME/fasttrack-admin-panel.git
cd fasttrack

Option B: ZIP Download

Download ZIP from GitHub

Extract

Open folder in VS Code

✅ STEP-3: Backend Setup
3.1 Go to backend folder
cd backend

3.2 Install dependencies
npm install

✅ STEP-4: MongoDB Setup
4.1 Create MongoDB Atlas Account

Go to https://www.mongodb.com/cloud/atlas

Create free cluster

4.2 Get Connection String

Example:

mongodb+srv://username:password@cluster.mongodb.net/fasttrack

✅ STEP-5: Create .env File (LOCAL ONLY)

📍 Location: backend/.env

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fasttrack
PORT=2012


⚠️ Do NOT upload .env to GitHub

✅ STEP-6: Run Server Locally
node server.js


You should see:

MongoDB Connected
Server running on http://localhost:2012

✅ STEP-7: Access Pages (LOCAL)
Admin Login Page
http://localhost:2012/

Admin Credentials
Username: admin
Password: 12345

Admin Dashboard (Protected)
http://localhost:2012/admin


❌ Direct access without login is blocked

✅ STEP-8: Admin Dashboard Features

✔️ Login session
✔️ Logout with confirmation
✔️ Auto logout after 5 minutes idle
✔️ Search by service / phone
✔️ Stats cards (Total / Today / Emergency)
✔️ Charts (Line + Pie)
✔️ Protected routes

✅ STEP-9: GitHub Upload
9.1 Create .gitignore
node_modules
.env

9.2 Initialize Git
git init
git add .
git commit -m "Admin panel ready"

9.3 Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fasttrack-admin-panel.git
git push -u origin main

✅ STEP-10: Deploy on Render (LIVE)
10.1 Login

https://render.com

Login with GitHub

10.2 Create Web Service

New → Web Service

Select your repo

10.3 Render Settings
Setting	Value
Root Directory	backend
Build Command	npm install
Start Command	node server.js
✅ STEP-11: Add Environment Variables on Render

Render Dashboard → Environment

KEY	VALUE
MONGO_URI	mongodb+srv://username:password@cluster.mongodb.net/fasttrack
✅ STEP-12: Deploy

Click Create Web Service

Logs should show:

MongoDB Connected
Server running on port xxxx

✅ STEP-13: Live URL

After deploy, Render gives URL like:

https://fasttrack-admin.onrender.com

Live Access:

Login Page: /

Dashboard: /admin

🔐 Security Notes (Important)

Change admin credentials before production

Use bcrypt for password hashing

Use HTTPS only

Never expose .env

🛠 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

Express-session

Tailwind CSS

Chart.js

Render (Deployment)

📌 Future Improvements

Multiple admin roles

Export to Excel / PDF

Email notifications

JWT authentication

Audit logs

👨‍💻 Author

Built step-by-step for learning & production-ready admin panel 🚀