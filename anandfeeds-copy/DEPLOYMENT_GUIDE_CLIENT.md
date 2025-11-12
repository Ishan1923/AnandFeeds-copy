# Complete Deployment Guide: Vercel + Supabase + Render (using client's Google account)

## Overview
This guide walks through deploying Anand Feeds with zero upfront cost using the client's Google account:
- **Frontend**: Vercel (free tier)
- **Database**: Supabase Postgres (free tier)
- **CMS Backend**: Render (free tier) or Railway
- **File Uploads**: Cloudinary (free tier)
- **Authentication**: Firebase + NextAuth (free tier)

All services are in the client's accounts; no costs until scale-up.

---

## Step 1: Client Setup - GCP & Firebase (Client does this)

### 1.1 Create a GCP Project
1. Go to https://console.cloud.google.com
2. Create a new project: "Anand Feeds"
3. Enable billing (required, but you won't be charged while using free tiers)
4. Enable these APIs:
   - Firebase Management API
   - Firebase Authentication API
   - Firebase Realtime Database API
   - Cloud Build API
   - Cloud Run API (optional, if deploying backend to GCP)

### 1.2 Create a Firebase Project
1. Go to https://console.firebase.google.com
2. Create a new Firebase project (link to the GCP project above)
3. Choose a project name (e.g., "Anand Feeds")
4. Go to **Project Settings** (gear icon, top-left)
5. Under "Web" app, copy the Firebase config:
   ```
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "project-id.firebaseapp.com",
     projectId: "project-id",
     storageBucket: "project-id.appspot.com",
     messagingSenderId: "123...",
     appId: "1:123:web:abc...",
   };
   ```
6. **Share these values with you** (developer).

### 1.3 Enable Firebase Auth
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable:
   - Google
   - Email/Password
3. Add authorized domains (you'll do this after deploying to Vercel):
   - localhost:3000 (for local dev)
   - your-vercel-domain.vercel.app (after deploying)

---

## Step 2: Create Supabase Project (Client or You)

### 2.1 Sign up / Log in to Supabase
1. Go to https://app.supabase.com
2. Sign in with Google (use client's Google account if you want everything under one account)
3. Create a new project:
   - Project name: "anandfeeds-db"
   - Database password: (strong password, client keeps this secure)
   - Region: choose nearest to your users
4. Wait for project to initialize (~2 min)

### 2.2 Get the Database Connection String
1. In Supabase project, go to **Settings** → **Database** → **Connection string**
2. Copy the "Connection string (URI)" — looks like:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.supabase.co:5432/postgres?sslmode=require
   ```
3. **Save this securely** (you'll use it in .env for both Strapi and Vercel/Render)

---

## Step 3: Create Cloudinary Account (for uploads)

### 3.1 Sign up to Cloudinary
1. Go to https://cloudinary.com
2. Create account (free tier for MVP)
3. From Dashboard, note:
   - Cloud Name
   - API Key
   - API Secret
4. **Share with you** for Strapi config

---

## Step 4: Prepare Your Code (You do this locally)

### 4.1 Update Frontend .env.local
Create `anand-feeds-frontend/.env.local` (do NOT commit to git):
```bash
# NextAuth
NEXT_AUTH_SECRET="generate-random-secret"
# Generate: openssl rand -base64 32
NEXT_AUTH_GOOGLE_ID="your-google-oauth-id"
NEXT_AUTH_GOOGLE_SECRET="your-google-oauth-secret"

# Strapi (backend)
NEXT_PUBLIC_STRAPI_API_URL="https://your-render-strapi.onrender.com/api"
NEXT_PUBLIC_STRAPI="https://your-render-strapi.onrender.com"
STRAPI_AUTH_API="strapi-api-token"

# Firebase (from client's Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="anand-feeds-bdd31.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="anand-feeds-bdd31"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="anand-feeds-bdd31.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="197741621267"
NEXT_PUBLIC_FIREBASE_APP_ID="1:197741621267:web:..."

# PhonePe
PHONEPE_PROD_URL="https://api.phonepe.com/apis/hermes/pg/v1"
PHONEPE_SALT_KEY="your-salt"
PHONEPE_MERCHANT_ID="your-merchant-id"
PHONEPE_KEY_INDEX=1
```

### 4.2 Update CMS .env
Create `anand-feeds-cms/.env` (do NOT commit to git):
```bash
# Database (Postgres on Supabase)
DATABASE_CLIENT=postgres
DATABASE_URL="postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres?sslmode=require"

# Strapi Secrets
APP_KEYS="key1,key2,key3,key4"
API_TOKEN_SALT="salt1"
ADMIN_JWT_SECRET="secret1"
TRANSFER_TOKEN_SALT="salt2"
JWT_SECRET="secret2"

# Cloudinary
CLOUDINARY_NAME="your-cloud-name"
CLOUDINARY_KEY="your-key"
CLOUDINARY_SECRET="your-secret"
```

---

## Step 5: Deploy to Render (Strapi backend)

### 5.1 Push to GitHub
```bash
git add .
git commit -m "Add Dockerfile and deployment config"
git push origin main
```

### 5.2 Create Render Service
1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo (anandfeeds-copy/anand-feeds-cms)
5. Fill in:
   - **Name**: strapi-cms
   - **Runtime**: Docker
   - **Build command**: (leave default or `npm ci && npm run build`)
   - **Start command**: `npm start`
   - **Instance type**: Free
6. Under "Advanced", add environment variables (from CMS .env):
   - DATABASE_URL
   - APP_KEYS
   - API_TOKEN_SALT
   - ADMIN_JWT_SECRET
   - TRANSFER_TOKEN_SALT
   - JWT_SECRET
   - CLOUDINARY_NAME
   - CLOUDINARY_KEY
   - CLOUDINARY_SECRET
7. Deploy

### 5.3 Get Strapi Public URL
After deploy, note the Render URL (e.g., `https://strapi-cms.onrender.com`)

### 5.4 Create Strapi Admin User
1. Visit https://strapi-cms.onrender.com/admin
2. Create admin account
3. In Strapi Admin, go to **Settings** → **API Tokens** → **Create new token**
4. Copy the token and save it as `STRAPI_AUTH_API` for frontend .env

---

## Step 6: Deploy Frontend to Vercel

### 6.1 Update .env.local (again, with Render URL and API token)
```bash
NEXT_PUBLIC_STRAPI_API_URL="https://strapi-cms.onrender.com/api"
NEXT_PUBLIC_STRAPI="https://strapi-cms.onrender.com"
STRAPI_AUTH_API="<api-token-from-step-5.4>"
```

### 6.2 Deploy to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import project → select `anand-feeds-frontend`
4. Add environment variables in Vercel dashboard (copy from .env.local):
   - NEXT_AUTH_SECRET
   - NEXT_AUTH_GOOGLE_ID
   - NEXT_AUTH_GOOGLE_SECRET
   - NEXT_PUBLIC_STRAPI_API_URL
   - NEXT_PUBLIC_STRAPI
   - STRAPI_AUTH_API
   - All NEXT_PUBLIC_FIREBASE_* values
   - PhonePe keys
5. Deploy

### 6.3 Get Vercel URL
After deploy, note the Vercel URL (e.g., `https://anand-feeds.vercel.app`)

### 6.4 Add Firebase Authorized Domain
1. Go to Firebase Console → Authentication → Sign-in method
2. Add authorized domain: `your-vercel-domain.vercel.app`

---

## Step 7: Migrate Data (if needed)

If you have data in local SQLite Strapi, migrate it to Supabase Postgres:

```bash
# Start local Strapi (connect to Supabase)
cd anand-feeds-cms
DATABASE_URL="postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres?sslmode=require" npm run develop

# In another terminal, run migration script
SRC_URL=http://localhost:1337 \
DST_URL=https://strapi-cms.onrender.com \
STRAPI_TOKEN=<api-token> \
node scripts/migrate-strapi-to-supabase.js
```

---

## Step 8: Verify Everything

1. **Admin**: https://strapi-cms.onrender.com/admin → sign in
2. **Frontend**: https://your-vercel-domain.vercel.app
3. **Login**: click login, try Google OAuth
4. **Products page**: verify products load from Strapi API
5. **PhonePe**: test payment flow (use test credentials if available)

---

## Costs & Limits (as of Nov 2024)

| Service | Free Tier | Cost when scale |
|---------|-----------|-----------------|
| Vercel | 100 GB bandwidth/mo | $20+/mo |
| Supabase Postgres | 500 MB DB, 2GB bandwidth | $25+/mo |
| Render | 750 hrs/mo | $7+/mo |
| Cloudinary | 25 GB/mo | $99+/mo |
| Firebase | 10GB Auth | Pay per use |
| **Total** | **FREE** | **$52+/mo at scale** |

---

## Troubleshooting

**Strapi won't start on Render**
- Check Render logs for errors
- Verify DATABASE_URL is correct (Supabase connection string)
- Check APP_KEYS format (comma-separated)

**Frontend can't connect to Strapi**
- Verify NEXT_PUBLIC_STRAPI_API_URL is correct (use https)
- Check CORS in Strapi `config/middlewares.js` allows Vercel domain

**Firebase login not working**
- Verify redirect URIs in Firebase Console match Vercel domain
- Check NEXT_AUTH_* keys in Vercel env vars

**Cloudinary uploads fail**
- Verify CLOUDINARY_* keys in Strapi .env
- Check Cloudinary API key has upload permission

---

## Next Steps

1. Client creates GCP + Firebase project (Step 1)
2. Client creates Supabase project (Step 2)
3. You receive Firebase config from client
4. You update .env files locally (Step 4)
5. You deploy to Render + Vercel (Steps 5–6)
6. Test and verify (Step 8)
7. Go live!

---

## Files Reference

- Frontend env template: `anand-feeds-frontend/.env.example`
- CMS env template: `anand-feeds-cms/.env.example`
- Dockerfile: `anand-feeds-cms/Dockerfile`
- Cloudinary config: `anand-feeds-cms/config/plugins.js`
- Migration script: `scripts/migrate-strapi-to-supabase.js`

