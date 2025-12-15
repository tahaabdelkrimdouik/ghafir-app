"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/bottomNav";
import QiblaCompass from "@/components/qibla-compass";

export default function QiblaPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background dark:bg-black transition-colors duration-500">
      <Navbar />
      <main className="flex-1 pb-24 pt-24">
        <div className="p-4 text-center pt-8 animate-in zoom-in-95 duration-500">
          <QiblaCompass />
        </div>
      </main>
      <BottomNav activeTab="qibla" setActiveTab={() => {}} />
    </div>
  );
}
