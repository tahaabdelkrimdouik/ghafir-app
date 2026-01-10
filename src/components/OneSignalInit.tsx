// components/OneSignalInit.tsx
"use client";

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInit() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      runOneSignal();
    }
  }, []);

  const runOneSignal = async () => {
    try {
      await OneSignal.init({
        // 👇 Use the REAL IDs you just got
      appId: "cf923962-8ca5-4813-aa44-55e76ac54f5e",
      safari_web_id: "web.onesignal.auto.424123c9-df63-4140-aac8-764c37d1fc19",
        
        notifyButton: {
          enable: true,
        },
        // 👇 Keep this true while testing on your computer
        allowLocalhostAsSecureOrigin: true, 
      });
    } catch (error) {
      console.error('OneSignal init error', error);
    }
  };

  return null;
}