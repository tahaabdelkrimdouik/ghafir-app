import { PrayerTime } from "@/helpers/usePrayerData";

/**
 * Schedule local notifications for remaining prayer times today
 * Uses the browser's Notification API for local scheduling
 */
export async function schedulePrayerNotifications(prayerTimes: PrayerTime[]) {
  // Check if notifications are supported
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return;
  }

  // Request permission if not already granted
  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Clear any existing scheduled notifications (optional - you might want to keep them)
  // This is a simple implementation - in production, you'd want to track notification IDs

  // Schedule notifications for remaining prayers today
  for (const prayer of prayerTimes) {
    const [hours, minutes] = prayer.time.split(":").map(Number);
    const prayerTime = new Date(today);
    prayerTime.setHours(hours, minutes, 0, 0);

    // Only schedule if the prayer time is in the future
    if (prayerTime > now) {
      const timeUntilPrayer = prayerTime.getTime() - now.getTime();

      // Schedule notification 5 minutes before prayer time
      const notificationTime = timeUntilPrayer - 5 * 60 * 1000; // 5 minutes in milliseconds

      if (notificationTime > 0) {
        setTimeout(() => {
          new Notification(`وقت ${prayer.arabicName}`, {
            body: `تبقى 5 دقائق على ${prayer.arabicName}`,
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            tag: `prayer-${prayer.name}`, // Tag to prevent duplicate notifications
            requireInteraction: false,
          });
        }, notificationTime);

        // Also schedule notification at exact prayer time
        setTimeout(() => {
          new Notification(`حان وقت ${prayer.arabicName}`, {
            body: `حان الآن وقت صلاة ${prayer.arabicName}`,
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            tag: `prayer-${prayer.name}-now`,
            requireInteraction: true,
          });
        }, timeUntilPrayer);
      }
    }
  }
}

/**
 * Cancel all scheduled prayer notifications
 * Note: This is a simplified version. In production, you'd track notification IDs
 */
export function cancelPrayerNotifications() {
  // Note: The browser's Notification API doesn't provide a direct way to cancel
  // scheduled notifications created with setTimeout. You would need to:
  // 1. Store timeout IDs and clear them with clearTimeout
  // 2. Or use a service worker with background sync
  // This is a placeholder for future implementation
  console.log("Notification cancellation would be implemented here");
}

