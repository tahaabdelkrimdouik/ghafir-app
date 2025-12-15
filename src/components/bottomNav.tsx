// components/BottomNav.tsx
"use client";

import { Home, BookOpen, Compass, Clock, Settings, LucideIcon } from "lucide-react";
import { arabicTranslations } from "@/helpers/translation";
import { useRouter, usePathname } from "next/navigation";

// Define the Tab types here or import from a shared types file
export type TabType = "home" | "prayer" | "dhikr" | "qibla" | "settings";

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Map tabs to explicit routes so nav works from any page (including /settings)
  const navItems: { id: TabType; icon: LucideIcon; label: string; path: string }[] = [
    { id: "home", icon: Home, label: arabicTranslations.home, path: "/" },
    { id: "prayer", icon: Clock, label: arabicTranslations.prayer, path: "/prayer" },
    { id: "dhikr", icon: BookOpen, label: arabicTranslations.dhikr, path: "/dhikr" },
    { id: "qibla", icon: Compass, label: arabicTranslations.qibla, path: "/qibla" },
    { id: "settings", icon: Settings, label: "الإعدادات", path: "/settings" },
  ];

  // Derive current tab from pathname (fall back to passed activeTab for index-page in-memory switching)
  const pathToTab: Record<string, TabType> = {
    "/": "home",
    "/prayer": "prayer",
    "/dhikr": "dhikr",
    "/qibla": "qibla",
    "/settings": "settings",
  };

  const currentTab = pathToTab[pathname || "/"] ?? activeTab;

  return (
    <nav className="fixed bottom-0 right-0 left-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 dark:bg-black/80 dark:border-white/10 dark:text-gray-100 transition-colors duration-300 pb-safe">
      <div className="flex items-center justify-around py-3 pb-5">
        {navItems.map((tab) => {
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                // If already on index and clicking 'home', prefer updating in-memory tab if setter exists
                if (tab.path === "/" && pathname === "/" && setActiveTab) {
                  setActiveTab(tab.id);
                  return;
                }

                // Navigate to the route for the tab
                router.push(tab.path);
              }}
              className={`flex flex-col items-center gap-1 transition-all duration-300 min-h-[44px] px-3 py-2 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 scale-110"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium font-arabic">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}