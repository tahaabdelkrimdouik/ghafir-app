This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Deployment

### Quick Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your repository

3. **Add Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

4. **Deploy!** Vercel will automatically build and deploy your app.

### Detailed Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions, troubleshooting, and alternative platforms.

### Environment Variables Required

Create a `.env.local` file (or set in Vercel dashboard):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📱 PWA Features

This app is a Progressive Web App (PWA) with:
- ✅ Offline support
- ✅ Installable on mobile/desktop
- ✅ Push notifications (ready for backend)
- ✅ App shortcuts (long-press on icon)
- ✅ Service worker caching

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **PWA:** next-pwa
- **Icons:** Lucide React
- **Language:** Arabic (RTL)

---

## 📄 License

This project is private.
