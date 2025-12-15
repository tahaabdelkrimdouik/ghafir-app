"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/bottomNav";
import PrayerTimes from "@/components/prayer-times";

export default function PrayerPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background dark:bg-black transition-colors duration-500">
      <Navbar />
      <main className="flex-1 pb-24 pt-24">
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <PrayerTimes />
        </div>
      </main>
      <BottomNav activeTab="prayer" setActiveTab={() => {}} />
    </div>
  );
}
