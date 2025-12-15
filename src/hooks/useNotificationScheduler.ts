import { useState, useEffect, useCallback } from 'react';

export type NotificationFrequency = 'hourly' | 'every_5_hours' | 'daily' | 'none';

const NOTIFICATION_PREFERENCE_KEY = 'dhikr-notification-frequency';
const ONBOARDING_COMPLETE_KEY = 'onboarding-complete';

export const useNotificationScheduler = () => {
  const [frequency, setFrequency] = useState<NotificationFrequency>('none');
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if onboarding is complete
    const onboardingStatus = localStorage.getItem(ONBOARDING_COMPLETE_KEY);
    setOnboardingComplete(onboardingStatus === 'true');

    // Load notification frequency preference
    const stored = localStorage.getItem(NOTIFICATION_PREFERENCE_KEY);
    if (stored && ['hourly', 'every_5_hours', 'daily', 'none'].includes(stored)) {
      setFrequency(stored as NotificationFrequency);
    }

    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Set notification frequency and request permission if needed
  const setNotificationFrequency = useCallback(
    async (newFrequency: NotificationFrequency) => {
      if (typeof window === 'undefined') return;

      setFrequency(newFrequency);
      localStorage.setItem(NOTIFICATION_PREFERENCE_KEY, newFrequency);

      // If user selects a frequency other than 'none', request permission
      if (newFrequency !== 'none' && permission !== 'granted') {
        await requestPermission();
      }

      // Schedule notifications based on frequency
      if (newFrequency !== 'none' && permission === 'granted') {
        scheduleNotifications(newFrequency);
      }
    },
    [permission, requestPermission]
  );

  // Mark onboarding as complete
  const completeOnboarding = useCallback((selectedFrequency: NotificationFrequency) => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    setOnboardingComplete(true);
    setNotificationFrequency(selectedFrequency);
  }, [setNotificationFrequency]);

  // Schedule notifications based on frequency
  const scheduleNotifications = useCallback((freq: NotificationFrequency) => {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('Service Worker or Notifications not supported');
      return;
    }

    // For now, we'll simulate scheduling
    // In a real PWA, you would register a service worker and use the Notification API
    // or use the Web Push API for background notifications

    switch (freq) {
      case 'hourly':
        // Schedule hourly notifications (would need service worker)
        console.log('Scheduling hourly dhikr reminders');
        break;
      case 'every_5_hours':
        // Schedule every 5 hours
        console.log('Scheduling dhikr reminders every 5 hours');
        break;
      case 'daily':
        // Schedule daily notification
        console.log('Scheduling daily dhikr reminder');
        break;
      case 'none':
        // Cancel all scheduled notifications
        console.log('Canceling all scheduled notifications');
        break;
    }
  }, []);

  return {
    frequency,
    permission,
    onboardingComplete,
    setNotificationFrequency,
    requestPermission,
    completeOnboarding,
  };
};

