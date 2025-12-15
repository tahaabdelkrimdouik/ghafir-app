"use client";

import { useState, useEffect } from "react"; // أضف useEffect هنا
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotificationScheduler, NotificationFrequency } from "@/hooks/useNotificationScheduler";
import { Sparkles, Clock, Bell, BellOff } from "lucide-react";

export default function OnboardingModal() {
  // 1. قم بجلب onboardingComplete من الـ Hook
  const { completeOnboarding, requestPermission, onboardingComplete } = useNotificationScheduler();
  const [selectedFrequency, setSelectedFrequency] = useState<NotificationFrequency | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // حالة محلية للتأكد من أننا لا نعرض المودال أثناء التحميل الأولي (تجنب الوميض)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. إذا لم يتم التحميل بعد، أو إذا اكتمل الإعداد، لا تعرض شيئاً (إغلاق المودال)
  if (!mounted || onboardingComplete) return null;

  const frequencyOptions: {
    value: NotificationFrequency;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "hourly",
      label: "كل ساعة",
      description: "تذكير كل ساعة",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      value: "every_5_hours",
      label: "كل 5 ساعات",
      description: "تذكير كل 5 ساعات",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      value: "daily",
      label: "مرة واحدة يومياً",
      description: "تذكير يومي واحد",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      value: "none",
      label: "لا تذكير",
      description: "لا أريد تذكيرات",
      icon: <BellOff className="w-5 h-5" />,
    },
  ];

  const handleSubmit = async () => {
    if (!selectedFrequency) return;

    setIsSubmitting(true);
    
    if (selectedFrequency !== "none") {
      await requestPermission();
    }

    // سيقوم هذا بتحديث الحالة onboardingComplete إلى true، مما يؤدي لإخفاء المودال فوراً
    completeOnboarding(selectedFrequency);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-md border-2 border-purple-200 dark:border-purple-800 shadow-2xl bg-white dark:bg-slate-950">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="flex justify-center mb-2">
            <Sparkles className="w-12 h-12 text-purple-500 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-purple-600 dark:text-purple-300">
            مرحباً بك في غافر
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            كيف تريد أن نذكرك بالأذكار؟
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFrequency(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-right ${
                  selectedFrequency === option.value
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-600 dark:text-purple-400">
                        {option.icon}
                      </span>
                      <span className="font-semibold text-foreground">
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  {selectedFrequency === option.value && (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedFrequency || isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg transition-transform active:scale-95"
          >
            {isSubmitting ? "جاري الحفظ..." : "متابعة"}
          </Button>

          <p className="text-xs text-center text-muted-foreground pt-2">
            يمكنك تغيير هذا الإعداد لاحقاً من صفحة الإعدادات
          </p>
        </CardContent>
      </Card>
    </div>
  );
}