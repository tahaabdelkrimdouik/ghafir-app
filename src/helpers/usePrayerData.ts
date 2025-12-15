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
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLoading(false);
      return;
    }

    // Request permission immediately on mount
    const requestLocation = async () => {
      try {
        // Check if permission is already granted
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName }).catch(() => null);
        
        if (permission?.state === 'prompt' || permission?.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
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
            },
            (error) => {
              console.error("Geolocation error:", error);
              setLoading(false);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          // Permission denied or not available
          setLoading(false);
        }
      } catch (err) {
        // Fallback: try to get position anyway (some browsers don't support permissions API)
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              const locRes = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`
              );
              const locData = await locRes.json();
              setLocation(locData.city || locData.locality || "غير معروف");

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
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }
    };

    requestLocation();
  }, []);

  return { prayerTimes, location, loading };
};