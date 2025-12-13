// app/page.tsx (or wherever your main page is)
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreativeHome from "../components/creativeHome";
import BottomNav, { TabType } from "@/components/bottomNav";
import PrayerTimes from "@/components/prayer-times";
import DhikrCounter from "@/components/dhikr-counter";
import QiblaCompass from "@/components/qibla-compass";
import RandomAyahCard from "@/components/RandomAyahCard";
import { NotificationSetup } from "@/components/NotificationSetup";
import { usePrayerData } from "@/helpers/usePrayerData"; // The hook we created

function PageContent() {
  const searchParams = useSearchParams();
  
  // 1. UI State
  const [activeTab, setActiveTab] = useState<TabType>("home");
  
  // Handle query parameters from PWA shortcuts
  useEffect(() => {
    const type = searchParams.get("type");
    const qibla = searchParams.get("qibla");
    const mode = searchParams.get("mode");
    const duaa = searchParams.get("duaa");

    if (qibla === "true") {
      setActiveTab("qibla");
    } else if (type === "morning") {
      setActiveTab("dhikr");
      // You can add additional logic here to filter to morning dhikr
      // For example, pass a prop to DhikrCounter or use state
    } else if (mode === "single") {
      setActiveTab("dhikr");
      // You can add logic to show single dhikr mode
    } else if (duaa === "emergency") {
      // For now, just navigate to home or dhikr
      // You can create a dedicated emergency duaa component later
      setActiveTab("dhikr");
    }
  }, [searchParams]);

  // 2. Data Logic (Abstracted away!)
  const { prayerTimes } = usePrayerData();

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-black transition-colors duration-500">
      
      {/* Top Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 pt-24">
        {activeTab === "home" && (
          <div className="animate-in fade-in duration-500">
            {/* Negative margin to pull Hero up behind the Navbar transparency if desired, or standard flow */}
            <div className="-mt-24 mb-6">
              <CreativeHome prayerTimes={prayerTimes} />
            </div>

            <div className="max-w-4xl mx-auto px-4 space-y-6">
              <RandomAyahCard />
            </div>
          </div>
        )}

        {activeTab === "prayer" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <PrayerTimes />
          </div>
        )}

        {activeTab === "dhikr" && (
          <div className="p-4 text-center pt-8 animate-in zoom-in-95 duration-500">
            <DhikrCounter />
          </div>
        )}

        {activeTab === "qibla" && (
          <div className="p-4 text-center pt-8 animate-in zoom-in-95 duration-500">
            <QiblaCompass />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Notification Setup */}
      <NotificationSetup prayerTimes={prayerTimes} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <PageContent />
    </Suspense>
  );
}