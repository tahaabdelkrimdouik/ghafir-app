"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/bottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/helpers/useNavbarLogic";
import { useNotificationScheduler, NotificationFrequency } from "@/hooks/useNotificationScheduler";
import { ArrowLeft, Trash2, Sun, Moon, Bell, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { frequency, setNotificationFrequency, requestPermission, permission } = useNotificationScheduler();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const frequencyOptions: {
    value: NotificationFrequency;
    label: string;
    description: string;
  }[] = [
    {
      value: "hourly",
      label: "كل ساعة",
      description: "تذكير كل ساعة",
    },
    {
      value: "every_5_hours",
      label: "كل 5 ساعات",
      description: "تذكير كل 5 ساعات",
    },
    {
      value: "daily",
      label: "مرة واحدة يومياً",
      description: "تذكير يومي واحد",
    },
    {
      value: "none",
      label: "لا تذكير",
      description: "لا أريد تذكيرات",
    },
  ];

  const handleResetData = () => {
    setIsResetting(true);
    
    // Clear all localStorage data
    try {
      localStorage.clear();
      // Reload the page to reset everything
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error resetting data:", error);
      setIsResetting(false);
    }
  };

  const handleNotificationChange = async (newFrequency: NotificationFrequency) => {
    if (newFrequency !== "none" && permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) {
        alert("يرجى السماح بالإشعارات لتلقي التذكيرات");
        return;
      }
    }
    setNotificationFrequency(newFrequency);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background dark:bg-black transition-colors duration-500">
      <Navbar />
      <div className="flex-1 p-4 pb-32 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold font-arabic text-foreground">الإعدادات</h1>
          </div>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic flex items-center gap-2">
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
              المظهر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/50">
              <div>
                <p className="font-semibold font-arabic text-foreground">
                  {theme === "light" ? "فاتح (بنفسجي)" : "داكن (أسود)"}
                </p>
                <p className="text-sm text-muted-foreground font-arabic">
                  {theme === "light"
                    ? "المظهر الفاتح مع لون بنفسجي"
                    : "المظهر الداكن مع خلفية سوداء"}
                </p>
              </div>
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="font-arabic"
              >
                {theme === "light" ? "تفعيل الداكن" : "تفعيل الفاتح"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-500" />
              إعدادات الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {permission === "denied" && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200 font-arabic">
                  تم رفض الإذن بالإشعارات. يرجى تفعيله من إعدادات المتصفح.
                </p>
              </div>
            )}
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleNotificationChange(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-right ${
                  frequency === option.value
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground font-arabic mb-1">
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground font-arabic">
                      {option.description}
                    </p>
                  </div>
                  {frequency === option.value && (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Reset Data */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="font-arabic flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              إعادة تعيين البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground font-arabic">
              سيتم حذف جميع البيانات المحفوظة بما في ذلك تقدم الأذكار والإعدادات. لا يمكن التراجع عن هذا الإجراء.
            </p>
            {!showResetConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowResetConfirm(true)}
                className="w-full font-arabic"
              >
                حذف جميع البيانات
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-destructive font-arabic text-center">
                  هل أنت متأكد؟ سيتم حذف جميع البيانات.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 font-arabic"
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetData}
                    disabled={isResetting}
                    className="flex-1 font-arabic"
                  >
                    {isResetting ? "جاري الحذف..." : "تأكيد الحذف"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
      <BottomNav activeTab="settings" setActiveTab={() => {}} />
    </div>
  );
}

