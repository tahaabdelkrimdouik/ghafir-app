# 🚀 Deployment Guide for Ghafir App

## Recommended Platform: **Vercel** ⭐

**Why Vercel?**
- ✅ Made by Next.js creators (zero-config)
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS (required for PWA)
- ✅ Built-in CI/CD
- ✅ Global CDN
- ✅ Perfect for Next.js PWAs

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Required

Your app needs these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Optional (for scripts):**
```bash
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Build Test

Test your build locally before deploying:

```bash
npm run build
npm start
```

If the build succeeds, you're ready to deploy!

---

## 🎯 Deployment Steps (Vercel)

### Option A: Deploy via Vercel Dashboard (Recommended for First Time)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Sign up/Login with GitHub
   - Click "Add New Project"

3. **Import your repository**
   - Select your `ghafir-app-front` repository
   - Vercel will auto-detect Next.js

4. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `ghafir-app-front` (if repo is in subfolder)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = `your_supabase_url`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
   - Select "Production", "Preview", and "Development"
   - Click "Save"

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `your-app.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd ghafir-app-front
   vercel
   ```

4. **Follow prompts:**
   - Link to existing project or create new
   - Add environment variables when prompted
   - Deploy!

5. **Production deployment:**
   ```bash
   vercel --prod
   ```

---

## 🔧 Post-Deployment Configuration

### 1. Update Supabase URLs (if needed)

If your Supabase project has CORS restrictions, add your Vercel domain:
- Go to Supabase Dashboard → Settings → API
- Add your Vercel URL to allowed origins

### 2. Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### 3. Verify PWA Features

After deployment, test:
- ✅ App installs on mobile/desktop
- ✅ Works offline (service worker)
- ✅ Manifest.json loads correctly
- ✅ Icons display properly
- ✅ Shortcuts work (long-press on app icon)

---

## 🧪 Testing Your Deployment

### 1. Check Build Logs
- Go to Vercel Dashboard → Deployments
- Click on latest deployment
- Check for any errors

### 2. Test PWA Installation
- Open your deployed URL on mobile
- Look for "Add to Home Screen" prompt
- Install and test offline functionality

### 3. Test Features
- ✅ Prayer times load correctly
- ✅ Daily Ayah fetches
- ✅ Dhikr counter works
- ✅ Qibla compass works
- ✅ Notifications request permission

---

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to:
- `main` branch → Production
- Other branches → Preview deployments

No additional setup needed!

---

## 🌐 Alternative Deployment Options

### Netlify
- Similar to Vercel
- Good for Next.js
- Free tier available
- [netlify.com](https://netlify.com)

### Cloudflare Pages
- Free tier
- Fast global CDN
- Good for static exports
- [pages.cloudflare.com](https://pages.cloudflare.com)

### Railway / Render
- Full-stack hosting
- Good if you need backend services
- Paid plans available
- [railway.app](https://railway.app) / [render.com](https://render.com)

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### PWA Not Working
- Ensure HTTPS is enabled (automatic on Vercel)
- Check `manifest.json` is accessible
- Verify service worker is registered

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side
- Redeploy after adding variables
- Check variable names match exactly

### API Errors
- Verify external APIs (alquran.cloud, aladhan.com) are accessible
- Check CORS settings if needed
- Test API endpoints directly

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Optional)
- Go to Project Settings → Analytics
- Enable Web Analytics (free tier available)
- Track page views and performance

### Error Tracking (Recommended)
Consider adding:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Vercel Analytics** - Built-in analytics

---

## 🔐 Security Checklist

- ✅ Environment variables are set (not hardcoded)
- ✅ Supabase keys are using anon key (not service role in client)
- ✅ HTTPS is enabled (automatic on Vercel)
- ✅ No sensitive data in client-side code
- ✅ API keys are properly secured

---

## 📱 PWA-Specific Deployment Notes

1. **Service Worker**: Automatically generated by `next-pwa`
2. **Manifest**: Located at `/public/manifest.json`
3. **Icons**: Ensure `/public/icons/` folder has required icons
4. **HTTPS**: Required for PWA (automatic on Vercel)

---

## 🎉 You're Done!

Your app should now be live! Share your Vercel URL with users.

**Next Steps:**
- Set up custom domain (optional)
- Configure analytics
- Set up error tracking
- Test on multiple devices

---

## 📞 Need Help?

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Deployment: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- PWA Guide: [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps)

