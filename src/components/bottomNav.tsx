// components/BottomNav.tsx
import { Home, BookOpen, Compass, Clock, LucideIcon } from "lucide-react";
import { arabicTranslations } from "@/helpers/translation";

// Define the Tab types here or import from a shared types file
export type TabType = "home" | "prayer" | "dhikr" | "qibla";

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  
  const navItems: { id: TabType; icon: LucideIcon; label: string }[] = [
    { id: "home", icon: Home, label: arabicTranslations.home },
    { id: "prayer", icon: Clock, label: arabicTranslations.prayer },
    { id: "dhikr", icon: BookOpen, label: arabicTranslations.dhikr },
    { id: "qibla", icon: Compass, label: arabicTranslations.qibla },
  ];

  return (
    <nav className="fixed bottom-0 right-0 left-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 dark:bg-black/80 dark:border-white/10 dark:text-gray-100 transition-colors duration-300 pb-safe">
      <div className="flex items-center justify-around py-3 pb-5">
        {navItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === tab.id
                ? "text-indigo-600 dark:text-indigo-400 scale-110"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium font-arabic">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}