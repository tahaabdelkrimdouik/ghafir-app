// app/page.tsx (or wherever your main page is)
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreativeHome from "@/components/creativeHome";
import BottomNav, { TabType } from "@/components/bottomNav";
import RandomAyahCard from "@/components/RandomAyahCard";
import { NotificationSetup } from "@/components/NotificationSetup";
import { usePrayerData } from "@/helpers/usePrayerData"; // The hook we created
import OnboardingModal from "@/components/OnboardingModal";
import { useNotificationScheduler } from "@/hooks/useNotificationScheduler";

function PageContent() {
  const searchParams = useSearchParams();
  const { onboardingComplete } = useNotificationScheduler();
  
  // 1. UI State
  const [activeTab, setActiveTab] = useState<TabType>("home");
  
  // Handle query parameters from PWA shortcuts — redirect to the dedicated routes
  const router = useRouter();
  useEffect(() => {
    const type = searchParams.get("type");
    const qibla = searchParams.get("qibla");
    const mode = searchParams.get("mode");
    const duaa = searchParams.get("duaa");

    if (qibla === "true") {
      router.push("/qibla");
    } else if (type === "morning") {
      router.push("/dhikr");
    } else if (mode === "single") {
      router.push("/dhikr");
    } else if (duaa === "emergency") {
      router.push("/dhikr");
    }
  }, [searchParams, router]);

  // 2. Data Logic (Abstracted away!)
  const { prayerTimes } = usePrayerData();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background dark:bg-black transition-colors duration-500">
      {/* Onboarding Modal */}
      {!onboardingComplete && <OnboardingModal />}
      
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

        {/* Dedicated routes now handle prayer / dhikr / qibla pages. Home keeps CreativeHome and summary cards. */}
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
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center">جاري التحميل...</div>}>
      <PageContent />
    </Suspense>
  );
}