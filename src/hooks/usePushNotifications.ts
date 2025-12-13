"use client";

import { useState, useEffect } from "react";

type NotificationPermission = "default" | "granted" | "denied";

interface PushNotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  isSubscribed: boolean;
  error: string | null;
}

/**
 * Hook for managing push notifications
 * Handles permission requests and service worker registration
 * Note: Backend integration with Supabase will be added later
 */
export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    permission: "default",
    isSupported: false,
    isSubscribed: false,
    error: null,
  });

  useEffect(() => {
    // Check if browser supports notifications
    const isSupported = "Notification" in window && "serviceWorker" in navigator;
    
    if (!isSupported) {
      setState((prev) => ({
        ...prev,
        isSupported: false,
        error: "الإشعارات غير مدعومة في هذا المتصفح",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isSupported: true,
      permission: Notification.permission as NotificationPermission,
    }));

    // Register service worker if available
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
          
          // Listen for push events (when Supabase backend is ready)
          navigator.serviceWorker.addEventListener("message", (event) => {
            console.log("Message from service worker:", event.data);
            
            if (event.data && event.data.type === "PUSH_RECEIVED") {
              // Handle received push notification
              console.log("Push notification received:", event.data);
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
          setState((prev) => ({
            ...prev,
            error: "فشل تسجيل Service Worker",
          }));
        });
    }
  }, []);

  /**
   * Request notification permission from the user
   */
  const requestPermission = async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: "الإشعارات غير مدعومة",
      }));
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      setState((prev) => ({
        ...prev,
        permission: permission as NotificationPermission,
        error: permission === "denied" ? "تم رفض الإذن" : null,
      }));

      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setState((prev) => ({
        ...prev,
        error: "حدث خطأ أثناء طلب الإذن",
      }));
      return false;
    }
  };

  /**
   * Subscribe to push notifications
   * This will be fully implemented when Supabase backend is ready
   */
  const subscribeToPush = async (): Promise<boolean> => {
    if (state.permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) {
        return false;
      }
    }

    try {
      // TODO: Implement Supabase push subscription
      // For now, this is a placeholder
      console.log("Push subscription will be implemented with Supabase");
      
      setState((prev) => ({
        ...prev,
        isSubscribed: true,
      }));

      return true;
    } catch (error) {
      console.error("Error subscribing to push:", error);
      setState((prev) => ({
        ...prev,
        error: "فشل الاشتراك في الإشعارات",
        isSubscribed: false,
      }));
      return false;
    }
  };

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribeFromPush = async (): Promise<boolean> => {
    try {
      // TODO: Implement Supabase push unsubscription
      console.log("Push unsubscription will be implemented with Supabase");
      
      setState((prev) => ({
        ...prev,
        isSubscribed: false,
      }));

      return true;
    } catch (error) {
      console.error("Error unsubscribing from push:", error);
      return false;
    }
  };

  return {
    ...state,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
  };
}

