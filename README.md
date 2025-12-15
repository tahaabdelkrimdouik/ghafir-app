Here is a clean, professional `README.md` for your project. I have removed the "Private/Closed Source" warnings and restored a standard structure that focuses on the app's capabilities and setup.

-----

# 🌙 Ghafir

**Ghafir** is a modern, Islamic companion Progressive Web App (PWA). Designed with a focus on privacy and aesthetics, it provides accurate prayer times, interactive Dhikr sessions, and daily Quranic inspiration in a beautiful, offline-first interface.

## ✨ Features

  - **📍 Smart Prayer Times:** Automatically detects location to provide accurate times for Fajr, Dhuhr, Asr, Maghrib, and Isha.
  - **📿 Interactive Dhikr:**
      - **Session Mode:** Guided morning and evening Adhkar with step-by-step progress.
      - **Haptic Feedback:** Vibrations on every count for a tactile experience.
      - **Smart Saving:** Progress is saved locally, so you never lose your count.
  - **📖 Daily Ayah:** Features a new Quranic verse every 24 hours to inspire daily reflection.
  - **🧭 Qibla Compass:** High-precision direction finding using device gyroscope and magnetometer sensors.
  - **📱 Native PWA Experience:**
      - **Installable:** Add to home screen on iOS and Android.
      - **Offline Ready:** Works seamlessly without an internet connection.
      - **Instant Shortcuts:** Long-press the app icon to quickly access "Morning Dhikr" or "Qibla".

## 🛠️ Tech Stack

  - **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
  - **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  - **PWA:** `next-pwa` with Custom Service Workers
  - **Database:** Supabase (Notifications & User Data)
  - **Icons:** Lucide React
  - **APIs:** Aladhan (Prayer Times), AlQuran Cloud (Daily Ayah)

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### 1\. Prerequisites

  - Node.js 18.17 or later
  - npm, yarn, or pnpm

### 2\. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/ghafir-app.git
cd ghafir-app
npm install
```

### 3\. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4\. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 📱 PWA Instructions

To test the PWA features (installability, offline mode) locally, you must run the build command:

```bash
npm run build
npm start
```

Then open `localhost:3000`. In Chrome DevTools, you can simulate "Offline" mode in the Network tab to test caching.

## 📄 License

© 2025 douik taha abdelkrim. All Rights Reserved.
