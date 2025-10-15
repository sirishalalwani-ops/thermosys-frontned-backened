Thermosys Ready App (Frontend + Node backend)
===========================================

This package contains:
- frontend/index.html  -> static UI, posts to /order
- backend/server.js    -> Node.js + Express server that saves orders to orders.json and can send email notifications via SMTP (Outlook supported)

Quick local run
---------------

1) Backend:
   cd backend
   npm install
   create a .env file based on .env.example and fill in MAIL_PASS (Outlook app password or account password)
   node server.js

   By default the server runs on port 5000.

2) Frontend:
   Open frontend/index.html in a browser for quick testing.
   For best results, host the frontend on the same origin as backend (or set API URL):
   - If backend is at http://localhost:5000, set API_URL to that host in the frontend before deploying
   - When deploying to Vercel, set an Environment Variable named __API_URL to your backend URL (e.g. https://your-backend.onrender.com)

Outlook email instructions
--------------------------
- If using Outlook (hotmail/office365) with MFA enabled, create an app password to use as MAIL_PASS.
- SMTP host: smtp.office365.com, port 587, secure false.

Deploy
------
- Backend: Render.com (connect repository, set env vars from .env)
- Frontend: Vercel (deploy the frontend repo; set __API_URL environment variable to backend URL if different origins)

Security note
-------------
- Do NOT commit .env with real credentials to a public repository.
- Use Render/Vercel secret environment variables when deploying.

