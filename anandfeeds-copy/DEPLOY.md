Deployment guide — Vercel (frontend) + Supabase (Postgres) + Cloudinary (uploads) + Render (Strapi)

Overview
========
This guide walks through a low-cost / free-tier deployment for a startup MVP:
- Frontend (Next.js) → Vercel (free tier)
- Database (Postgres) → Supabase (free tier)
- File uploads → Cloudinary (free tier)
- Strapi CMS → Render or Railway (free tier)

High-level steps
----------------
1. Create accounts: Vercel, Supabase, Cloudinary, Render (or Railway)
2. Create a Supabase project and note the Postgres connection string
3. Configure Cloudinary and get API keys
4. Update Strapi config (.env) to use Supabase DATABASE_URL and Cloudinary keys
5. Push repo to GitHub, deploy Strapi on Render and set env vars
6. Deploy frontend on Vercel and set env vars to point to Strapi
7. Run the migration script to move data from local SQLite Strapi → cloud Strapi (if needed)

Commands & details
------------------
1) Supabase (create project)
- Go to https://app.supabase.com and create a new project. Choose a project name and password.
- In Project → Settings → Database → Connection string, copy the Postgres connection string (postgresql://...)

2) Cloudinary (create account)
- Create an account at https://cloudinary.com
- From Dashboard, note cloud name, API key, API secret

3) Prepare Strapi env
- In `anand-feeds-cms/.env` (create from `.env.example`) set:
  - DATABASE_CLIENT=postgres
  - DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db>?sslmode=require
  - APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, TRANSFER_TOKEN_SALT, JWT_SECRET (generate with openssl rand -base64 32)
  - CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET

4) Deploy Strapi to Render
- Push your repo to GitHub.
- On Render: New → Web Service → connect GitHub → select `anand-feeds-cms` repo and branch
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Add environment variables (DATABASE_URL, APP_KEYS, CLOUDINARY_*) in the Render dashboard

5) Deploy Frontend to Vercel
- Connect Vercel to your frontend repo. Import project.
- Set environment variables in Vercel dashboard:
  - NEXT_PUBLIC_STRAPI_API_URL=https://<your-strapi-url>/api
  - NEXT_PUBLIC_STRAPI=https://<your-strapi-url>
  - NEXT_AUTH_GOOGLE_ID / SECRET, NEXT_AUTH_SECRET, STRAPI_AUTH_API (Strapi API token)

6) Migrate data (optional)
- Start your cloud Strapi (Render). Create an API token in Strapi Admin (Settings → API Tokens)
- Run locally or on a machine with network access to both Strapi instances:

  SRC_URL=http://localhost:1337 DST_URL=https://<your-render-strapi> STRAPI_TOKEN=<api-token> node scripts/migrate-strapi-to-supabase.js

  The included script migrates `products` as an example. Extend it to other content types and to upload media files to Cloudinary.

7) Verify
- Admin: https://<your-render-strapi>/admin
- Frontend: https://<your-vercel-site>
- Check that products/pages show and images are served from Cloudinary

Notes & tips
--------------
- Free tiers have limits. Monitor usage and plan to upgrade when needed.
- Do NOT commit real secrets. Use `.env.example` in the repo and set secrets in each platform's env/secret UI.
- For backups, export Supabase DB snapshots or use their backup features.

If you want, I can now:
- Add the Cloudinary keys into `config/plugins.js` (already added) and create `.env.example` (done)
- Create the Dockerfile for Strapi (done)
- Walk you step-by-step through actually creating Supabase project and deploying on Render (I can provide exact commands you can paste)
