# Deployment Checklist

## Supabase Setup
- [ ] Create a new Supabase project
- [ ] Get the database connection URL
- [ ] Update Prisma schema if needed (already configured for PostgreSQL)

## Vercel Deployment

### Backend
- [ ] Create a new Vercel project
- [ ] Connect to the GitHub repository
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - `DATABASE_URL` = your Supabase PostgreSQL connection URL
  - `FRONTEND_URL` = your frontend URL (e.g., https://your-app.vercel.app)
- [ ] Deploy the backend
- [ ] Note the deployed URL for the frontend configuration

### Frontend
- [ ] Create a new Vercel project
- [ ] Connect to the GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variables:
  - `PUBLIC_API_URL` = your backend URL (from previous step)
- [ ] Deploy the frontend

## Post-Deployment
- [ ] Run database migrations (either locally with Supabase connection or through Supabase SQL editor)
- [ ] Test the deployed application
- [ ] Update any necessary CORS settings if needed