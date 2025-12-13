# ⚡ Quick Deploy Guide (5 Minutes)

## Step 1: Prepare Your Code (2 min)

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Get Your Supabase Keys (1 min)

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Deploy to Vercel (2 min)

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up/Login (use GitHub for easiest setup)

2. **Click "Add New Project"**
   - Import your `ghafir-app-front` repository
   - Vercel auto-detects Next.js ✅

3. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL = [paste your Supabase URL]
     NEXT_PUBLIC_SUPABASE_ANON_KEY = [paste your anon key]
     ```
   - Select all environments (Production, Preview, Development)
   - Click "Save"

4. **Click "Deploy"**
   - Wait 2-3 minutes
   - Your app is live! 🎉

## Step 4: Test (1 min)

1. Open your deployed URL (e.g., `your-app.vercel.app`)
2. Test:
   - ✅ App loads
   - ✅ Prayer times appear
   - ✅ Daily Ayah loads
   - ✅ Can navigate between tabs

## 🎯 That's It!

Your app is now live and accessible worldwide!

**Next Steps:**
- Add a custom domain (optional)
- Test PWA installation on mobile
- Share with users

---

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure environment variables are set correctly

**App doesn't work?**
- Check browser console for errors
- Verify Supabase keys are correct
- Ensure APIs are accessible

**Need help?**
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
- Check [PRE_DEPLOY_CHECKLIST.md](./PRE_DEPLOY_CHECKLIST.md)

