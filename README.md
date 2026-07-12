# Streamify - Free Video Streaming App with Ad Monetization

Watch free videos, earn money through Google AdSense. Built with React, Node.js, MongoDB.

## Quick Start

```bash
# Backend
cd backend && npm install && cp .env.example .env && npm run seed && npm run dev

# Frontend  
cd frontend && npm install && npm run dev
```

Demo: admin@streamify.com/admin123, creator@streamify.com/creator123

## Features
- Video streaming with HTML5 player
- Search, browse by category, like, comment
- Google AdSense (pre-roll, banner, sidebar, in-feed ads)
- JWT auth with roles (user/creator/admin)
- Responsive design

## Deploy Free
- Frontend: Vercel.com (set VITE_API_URL)
- Backend: Render.com (set MONGODB_URI, JWT_SECRET)
- Database: MongoDB Atlas free tier

## AdSense Setup
1. Deploy site, apply at google.com/adsense
2. Add publisher ID to frontend/src/components/AdBanner.jsx
3. Add script to frontend/index.html

## Tech Stack
React 18, Vite, Node.js, Express, MongoDB, JWT, Google AdSense
