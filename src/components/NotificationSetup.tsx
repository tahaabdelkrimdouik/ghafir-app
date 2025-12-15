"use client";

import { useEffect } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { schedulePrayerNotifications } from "@/helpers/notifications";
import { PrayerTime } from "@/helpers/usePrayerData";

/**
 * Component to set up notifications when prayer times are loaded
 * This can be included in your main page or app component
 */
export function NotificationSetup({ prayerTimes }: { prayerTimes: PrayerTime[] }) {
  const { requestPermission, permission, isSupported } = usePushNotifications();

  useEffect(() => {
    // Automatically request permission and schedule notifications when prayer times are available
    if (prayerTimes.length > 0 && permission === "granted") {
      schedulePrayerNotifications(prayerTimes);
    }
  }, [prayerTimes, permission]);

  // Optional: Show a button to enable notifications if permission is not granted
  if (!isSupported) {
    return null; // Don't show anything if notifications aren't supported
  }

  if (permission === "default") {
    return (
      <div className="fixed bottom-32 left-4 right-4 z-40 max-w-md mx-auto">
        <div className="bg-indigo-600 dark:bg-indigo-800 text-white p-4 rounded-lg shadow-lg">
          <p className="font-arabic text-sm mb-3">
            هل تريد تفعيل الإشعارات لتذكيرك بأوقات الصلاة؟
          </p>
          <button
            onClick={requestPermission}
            className="w-full bg-white text-indigo-600 font-arabic font-semibold py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors min-h-[44px]"
          >
            تفعيل الإشعارات
          </button>
        </div>
      </div>
    );
  }

  return null;
}

