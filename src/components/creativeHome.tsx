// components/CreativeHome.tsx
"use client";

import { useState, useEffect } from "react";
import { formatCountdown } from "@/helpers/utils";
import { arabicTranslations } from "@/helpers/translation";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { schedulePrayerNotifications } from "@/helpers/notifications";

type PrayerTime = {
  name: string;
  time: string;
  arabicName: string;
};

export default function CreativeHome() {
  const [timeOfDay, setTimeOfDay] = useState(arabicTranslations.evening);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeLeft: string } | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const { permission } = usePushNotifications();

  // Time of Day Greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay(arabicTranslations.goodMorning);
    else if (hour < 17) setTimeOfDay(arabicTranslations.goodAfternoon);
    else setTimeOfDay(arabicTranslations.goodEvening);
  }, []);

  // Fetch Prayer Times
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        setLoading(false);
        return;
      }

      try {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              // Get Prayer Times
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
              console.error("Error fetching prayer data", e);
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
      } catch (err) {
        console.error("Error requesting location:", err);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  // Notification Setup
  useEffect(() => {
    if (prayerTimes.length > 0 && permission === "granted") {
      schedulePrayerNotifications(prayerTimes);
    }
  }, [prayerTimes, permission]);

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (prayerTimes.length > 0 && !loading) {
        const now = new Date();
        let upcoming = null;
        let targetDate = null;

        for (const prayer of prayerTimes) {
          const [h, m] = prayer.time.split(":").map(Number);
          const prayerDate = new Date();
          prayerDate.setHours(h, m, 0, 0);

          if (prayerDate > now) {
            upcoming = prayer;
            targetDate = prayerDate;
            break;
          }
        }

        if (!upcoming) {
          upcoming = prayerTimes[0];
          const [h, m] = upcoming.time.split(":").map(Number);
          targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + 1);
          targetDate.setHours(h, m, 0, 0);
        }

        if (targetDate && upcoming) {
          const diff = targetDate.getTime() - now.getTime();
          setNextPrayer({
            name: upcoming.arabicName,
            timeLeft: formatCountdown(diff),
          });
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [prayerTimes, loading]);

  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-black transition-colors duration-500">
      <div className="relative h-[40vh] bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-900 overflow-hidden rounded-b-[40px] shadow-xl dark:shadow-purple-900/20 transition-all duration-500">
        <div className="relative z-10 pt-8 px-6 flex flex-col h-full justify-between pb-10">
          <h1 className="text-white/90 text-2xl font-light mt-4">{timeOfDay}</h1>
          
          <div className="backdrop-blur-xl bg-white/20 dark:bg-black/40 border border-white/30 dark:border-white/10 shadow-2xl rounded-2xl p-6 flex items-center justify-between">
            <div className="text-left">
              <p className="text-white text-3xl font-mono font-light tracking-tight drop-shadow-sm">
                {nextPrayer ? nextPrayer.timeLeft : "--:--:--"}
              </p>
              <p className="text-white/80 text-xs mt-1 font-medium">{arabicTranslations.timeLeft}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs uppercase tracking-wider mb-1 font-medium">{arabicTranslations.nextPrayer}</p>
              <h2 className="text-white text-4xl font-semibold drop-shadow-md">
                {nextPrayer ? nextPrayer.name : arabicTranslations.loading}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}