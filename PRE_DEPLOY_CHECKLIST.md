# ✅ Pre-Deployment Checklist

Use this checklist before deploying your app to ensure everything is ready.

## 🔐 Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Get from Supabase Dashboard → Settings → API
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Get from Supabase Dashboard → Settings → API
- [ ] Test that these work locally in `.env.local`

## 🏗️ Build Test

- [ ] Run `npm run build` successfully
- [ ] Run `npm start` and test the production build locally
- [ ] No TypeScript errors
- [ ] No ESLint errors (or acceptable warnings)

## 📱 PWA Assets

- [ ] `/public/icons/icon-192.png` exists
- [ ] `/public/icons/icon-512.png` exists
- [ ] `/public/manifest.json` is valid JSON
- [ ] Icons are properly sized and formatted

## 🧪 Feature Testing

- [ ] Prayer times load correctly
- [ ] Daily Ayah fetches and displays
- [ ] Dhikr counter works
- [ ] Qibla compass works
- [ ] Theme switcher works
- [ ] Navigation between tabs works
- [ ] App works on mobile viewport

## 🔗 External APIs

- [ ] Quran API (api.alquran.cloud) is accessible
- [ ] Prayer times API (api.aladhan.com) is accessible
- [ ] Location API (api.bigdatacloud.net) is accessible
- [ ] Supabase connection works

## 📦 Code Quality

- [ ] No console.log statements in production code (or acceptable)
- [ ] No hardcoded secrets or API keys
- [ ] All imports are correct
- [ ] No unused dependencies

## 📝 Documentation

- [ ] README.md is updated
- [ ] Environment variables are documented
- [ ] Deployment instructions are clear

## 🚀 Git Status

- [ ] All changes are committed
- [ ] Code is pushed to GitHub/GitLab
- [ ] `.env.local` is NOT committed (should be in .gitignore)
- [ ] `node_modules` is NOT committed

## 🎯 Ready to Deploy!

Once all items are checked, you're ready to deploy to Vercel!

**Quick Deploy:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

