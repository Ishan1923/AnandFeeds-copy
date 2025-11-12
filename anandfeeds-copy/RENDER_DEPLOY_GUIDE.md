# Render Deployment Guide for Strapi (anand-feeds-cms)

## Prerequisites
- GitHub repo: `AnandFeeds-copy` pushed and ready
- Supabase Postgres project created (DATABASE_URL ready)
- Cloudinary account with API keys
- Render account (https://render.com)

## Step 1: Create Render Web Service

1. Log in to https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Click **"Connect GitHub"** if not already connected
4. Select repository: **`AnandFeeds-copy`**
5. Configure settings:
   - **Name:** `anandfeeds-strapi` (or any name you prefer)
   - **Branch:** `main`
   - **Root Directory:** `anand-feeds-cms`
   - **Environment:** Docker (Render will auto-detect Dockerfile)
   - **Plan:** Starter or Free (if available)
   - **Auto-deploy:** On (optional, enables auto-deploy on GitHub push)
6. Click **"Create Web Service"**

Render will now queue the build. The service URL will be something like `https://anandfeeds-strapi.onrender.com`.

## Step 2: Add Environment Variables to Render

1. In Render dashboard, select your new service: **anandfeeds-strapi**
2. Click **"Environment"** (in left sidebar under service name)
3. Click **"Add Environment Variable"** and add each of the following:

### Copy/Paste each variable one by one:

**Core Strapi & Security:**
- `NODE_ENV` = `production`
- `NODE_OPTIONS` = `--max_old_space_size=512`
- `APP_KEYS` = `a7f9c2d1e5b8f3a6,b4e9f2c1a7d6e3f8,c6d3e9a2f5b8c1d7,e2f6a9b4c7d1e3f5`
- `JWT_SECRET` = `f7e4d2c8b1a9f3e6d5c2a8f1e7b4d6c3a9f2e8d1b6c4a7f3e2d9b5a8c1e7f4`
- `ADMIN_JWT_SECRET` = `c3b9e2f6a1d4e7b8c5f2a9d3e6b1c4f7a2d5e8b3c6f1a4d7e2b9c5f8a1d4e7`
- `API_TOKEN_SALT` = `d6f1c8a3e9b2f5d7c4e1a6b9f2d5e8c1a4f7b2d9e6c1a8f3b6d9e4c7a2f5b8`
- `TRANSFER_TOKEN_SALT` = `e8a2b5f9c3d6e1f4a7b2c9d4e3f6a1b8c5d2e9f4a7b6c3d8e1f2a9b4c7d`

**Database:**
- `DATABASE_CLIENT` = `postgres`
- `DATABASE_URL` = `postgresql://postgres:pA#wGSn4%-CtBnn@db.ntbhcoekdgsibclyxdsd.supabase.co:5432/postgres?sslmode=require`

**Cloudinary (replace with your actual keys):**
- `CLOUDINARY_NAME` = `your_cloudinary_cloud_name`
- `CLOUDINARY_KEY` = `your_cloudinary_api_key`
- `CLOUDINARY_SECRET` = `your_cloudinary_api_secret`

**Server Configuration:**
- `STRAPI_HOST` = `0.0.0.0`
- `STRAPI_PORT` = `1337`
- `STRAPI_URL` = `https://admin.anandfeeds.com`

## Step 3: Monitor the Deployment

1. In Render, the service will build automatically
2. Watch the **Logs** tab for build progress and errors
3. Expected logs:
   - `Docker build starting...`
   - `npm ci --silent`
   - `npm run build` (builds Strapi admin)
   - `npm start` (Strapi starts)
   - Message: `Server running in production`

If build fails, check logs for:
- Missing environment variables
- Database connection errors (ensure DATABASE_URL is correct and `?sslmode=require` is appended)
- Dockerfile or package.json issues

## Step 4: Access Strapi Admin (First Time Setup)

1. Once deployed successfully, visit your Render service URL + `/admin`:
   - Example: `https://anandfeeds-strapi.onrender.com/admin`
2. On first visit, Strapi will prompt you to **create the first admin user**:
   - Email: your email
   - Password: strong password
   - Confirm password
3. Click "Create Admin User"
4. Log in to the Strapi admin panel

## Step 5: Verify Database Connection & Content Types

1. In Strapi admin, go to **Content Manager** (left sidebar)
2. You should see your content types (Products, Categories, Orders, Users, Reviews, etc.)
3. All should be empty (0 entries) since this is a fresh Postgres database
4. Click on one (e.g., **Products**) and verify you can create a test entry to confirm DB is working

## Step 6: (Optional) Add Custom Domain

1. In Render service settings, click **"Custom Domains"**
2. Click **"Add Custom Domain"**
3. Enter: `admin.anandfeeds.com`
4. Render will show you the CNAME DNS record to add
5. At your domain registrar (where `anandfeeds.com` is registered):
   - Add CNAME record:
     - Name: `admin`
     - Value: (the CNAME from Render, e.g., `anandfeeds-strapi.onrender.com`)
6. Wait 5-15 minutes for DNS propagation
7. Once DNS is live, Render auto-provisions TLS (HTTPS)
8. Update `STRAPI_URL` in Render env to `https://admin.anandfeeds.com` and redeploy

## Step 7: Update Frontend to Use Production Strapi

Once Strapi is deployed, update your frontend `.env.local` (Vercel environment variables):

- `NEXT_PUBLIC_STRAPI_API_URL` = `https://admin.anandfeeds.com/api` (or your Render URL `/api`)
- `NEXT_PUBLIC_STRAPI` = `https://admin.anandfeeds.com` (or your Render URL)

Redeploy frontend in Vercel.

## Step 8: Data Migration (Next Steps)

After confirming Strapi is running:
1. Export data from local SQLite database (from your machine)
2. Migrate content and media to production Strapi
3. See `MIGRATION_GUIDE.md` for detailed steps

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails with "DATABASE_URL is required" | Check that DATABASE_URL env var is set correctly in Render |
| Strapi can't connect to Postgres | Verify password, host, and `?sslmode=require` in DATABASE_URL |
| Admin page shows 502 error | Check logs for runtime errors; may need to increase memory or wait for build to complete |
| Media uploads don't work | Verify CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET are correct |
| Custom domain not working | Ensure CNAME DNS record is added and propagated; check Render's DNS instructions |

## Notes

- Strapi will auto-create all required tables on first startup (Postgres migrations run automatically)
- DATABASE_URL contains your Supabase password; keep it secret and use Render's environment variable protection
- Render's free tier has sleep mode; use Starter plan ($7/month) for always-on service
- Cloudinary free tier includes 25GB of storage and up to 25 monthly transformations

---

**Next:** Once Strapi is live, run the data migration script to move your local data to production.
