// hooks/usePrayerData.ts
import { useState, useEffect } from 'react';

export type PrayerTime = {
  name: string;
  time: string;
  arabicName: string;
};

export const usePrayerData = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState("جاري التحديث...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        // 1. Get Location Name
        const locRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`
        );
        const locData = await locRes.json();
        setLocation(locData.city || locData.locality || "غير معروف");

        // 2. Get Prayer Times
        const date = new Date();
        const timeRes = await fetch(
          `https://api.aladhan.com/v1/timings/${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        const timeData = await timeRes.json();

        if (timeData.data?.timings) {
          const t = timeData.data.timings;
          setPrayerTimes([
            { name: "Fajr", time: t.Fajr, arabicName: "الفجر" },
            { name: "Dhuhr", time: t.Dhuhr, arabicName: "الظهر" },
            { name: "Asr", time: t.Asr, arabicName: "العصر" },
            { name: "Maghrib", time: t.Maghrib, arabicName: "المغرب" },
            { name: "Isha", time: t.Isha, arabicName: "العشاء" },
          ]);
        }
      } catch (e) {
        console.error("Error fetching data", e);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return { prayerTimes, location, loading };
};