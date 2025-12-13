"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2, CheckCircle, Clock, Sparkles } from "lucide-react";

type PrayerTime = {
  name: string;
  time: string;
  arabicName: string;
  dateTime: Date | null;
  passed: boolean;
  isNext: boolean;
  countdown: string;
};

export default function PrayerTimes() {
  const [location, setLocation] = useState<string>("Getting location...");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate countdown for a prayer time
  const calculateCountdown = (prayerDate: Date | null): string => {
    if (!prayerDate) return "";

    const now = new Date();
    const diffMs = prayerDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Passed";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    // Get user's location and fetch prayer times
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Fetch location name
            const locationRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const locationData = await locationRes.json();
            setLocation(
              `${locationData.city || locationData.locality}, ${
                locationData.countryName
              }`
            );

            // Fetch prayer times from Aladhan API
            const date = new Date();
            const prayerRes = await fetch(
              `https://api.aladhan.com/v1/timings/${date.getDate()}-${
                date.getMonth() + 1
              }-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=2`
            );
            const prayerData = await prayerRes.json();

            if (prayerData.data && prayerData.data.timings) {
              const timings = prayerData.data.timings;
              const now = new Date();

              // Convert prayer times to Date objects in fixed order
              const prayerTimesData = [
                { name: "Fajr", time: timings.Fajr, arabicName: "الفجر" },
                { name: "Dhuhr", time: timings.Dhuhr, arabicName: "الظهر" },
                { name: "Asr", time: timings.Asr, arabicName: "العصر" },
                {
                  name: "Maghrib",
                  time: timings.Maghrib,
                  arabicName: "المغرب",
                },
                { name: "Isha", time: timings.Isha, arabicName: "العشاء" },
              ].map((prayer) => {
                const [hours, minutes] = prayer.time.split(":").map(Number);
                const prayerDate = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate(),
                  hours,
                  minutes
                );

                return {
                  ...prayer,
                  dateTime: prayerDate,
                  passed: false,
                  isNext: false,
                  countdown: "",
                };
              });

              setPrayerTimes(prayerTimesData);
            }
          } catch (error) {
            console.error("Error fetching prayer times:", error);
            setLocation("Unable to fetch location");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Location access denied");
          setLoading(false);
        }
      );
    } else {
      setLocation("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  const getPrayerWithStatus = () => {
    if (prayerTimes.length === 0) return [];

    const now = currentTime;

    // Find the next prayer
    let nextPrayerIndex = -1;
    for (let i = 0; i < prayerTimes.length; i++) {
      if (prayerTimes[i].dateTime && prayerTimes[i].dateTime! > now) {
        nextPrayerIndex = i;
        break;
      }
    }

    // If no prayer found today, next is tomorrow's Fajr
    if (nextPrayerIndex === -1) {
      nextPrayerIndex = 0;
    }

    // Update all prayers with current status
    return prayerTimes.map((prayer, index) => {
      const isPassed = prayer.dateTime ? prayer.dateTime <= now : false;
      const isNext = index === nextPrayerIndex;

      // For tomorrow's Fajr case
      let dateTimeForCountdown = prayer.dateTime;
      if (isNext && isPassed && prayer.name === "Fajr") {
        dateTimeForCountdown = new Date(prayer.dateTime!);
        dateTimeForCountdown.setDate(dateTimeForCountdown.getDate() + 1);
      }

      const countdown = isNext ? calculateCountdown(dateTimeForCountdown) : "";

      return {
        ...prayer,
        passed: isPassed && !isNext,
        isNext: isNext,
        countdown: countdown,
      };
    });
  };

  const prayerTimesWithStatus = getPrayerWithStatus();

  const getPrayerStatusIcon = (prayer: PrayerTime) => {
    if (prayer.passed) {
      return <CheckCircle className="w-6 h-6 text-emerald-500" />;
    }
    if (prayer.isNext) {
      return <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />;
    }
    return <Clock className="w-6 h-6 text-purple-300/50" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100/30 to-pink-50 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-900 p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 dark:from-purple-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
            أوقات الصلاة
          </h1>
          <p className="text-purple-600/70 dark:text-purple-300/70 text-sm md:text-base">
            ابق على تواصل مع صلواتك اليومية
          </p>
        </div>

        {/* Current Time Card */}
        <Card className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white border-0 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjctNS4zNzMtMTItMTItMTJzLTEyIDUuMzczLTEyIDEyIDUuMzczIDEyIDEyIDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
          <CardContent className="pt-8 pb-8 relative z-10">
            <div className="text-center space-y-4">
              <div className="inline-block p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm opacity-90 mb-2">الوقت الحالي</p>
                <p className="text-5xl md:text-6xl font-bold font-mono tracking-tight">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm opacity-90 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm inline-flex">
                <MapPin size={16} />
                <span>{location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Times List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-200 flex items-center gap-2">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-full"></div>
            أوقات صلاة اليوم
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-purple-600 dark:text-purple-400" size={40} />
            </div>
          ) : prayerTimesWithStatus.length === 0 ? (
            <Card className="bg-white/80 dark:bg-black/40 backdrop-blur-sm">
              <CardContent className="pt-6">
                <p className="text-center text-purple-600/70 dark:text-purple-300/70">
                  Unable to load prayer times. Please check your location
                  settings.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {prayerTimesWithStatus.map((prayer, index) => (
                <Card
                  key={prayer.name}
                  className={`transition-all duration-500 hover:scale-[1.02] border-2 overflow-hidden relative ${
                    prayer.isNext
                      ? "bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-pink-500/10 dark:from-purple-500/20 dark:via-purple-400/10 dark:to-pink-500/20 border-purple-400 dark:border-purple-500 shadow-xl shadow-purple-200/50 dark:shadow-purple-900/50"
                      : prayer.passed
                      ? "bg-white/60 dark:bg-black/30 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 opacity-70"
                      : "bg-white/80 dark:bg-black/40 backdrop-blur-sm border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 shadow-md"
                  }`}
                  style={{
                    animation: prayer.isNext
                      ? "pulse-slow 3s ease-in-out infinite"
                      : "none",
                  }}
                >
                  {prayer.isNext && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-400 to-pink-500"></div>
                  )}
                  <CardContent className="py-4 px-4 sm:py-6 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`p-3 rounded-2xl transition-all duration-300 ${
                            prayer.isNext
                              ? "bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 shadow-lg shadow-purple-300/50 dark:shadow-purple-900/50"
                              : prayer.passed
                              ? "bg-emerald-100 dark:bg-emerald-900/30"
                              : "bg-purple-100 dark:bg-purple-900/30"
                          }`}
                        >
                          {getPrayerStatusIcon(prayer)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p
                              className={`text-xl sm:text-2xl font-bold ${
                                prayer.isNext
                                  ? "text-purple-600 dark:text-purple-300"
                                  : "text-purple-900 dark:text-purple-200"
                              }`}
                            >
                              {prayer.arabicName}
                            </p>
                            <p
                              className={`text-lg font-semibold ${
                                prayer.isNext
                                  ? "text-purple-500 dark:text-purple-300"
                                  : "text-purple-700 dark:text-purple-300"
                              }`}
                            >
                              {prayer.name}
                            </p>
                          </div>
                          {prayer.isNext && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1 rounded-full font-medium shadow-md">
                              <Sparkles className="w-3 h-3" />
                              الصلاة القادمة
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p
                          className={`text-3xl md:text-4xl font-bold font-mono ${
                            prayer.isNext
                              ? "text-purple-600 dark:text-purple-300"
                              : "text-purple-800 dark:text-purple-200"
                          }`}
                        >
                          {prayer.time}
                        </p>
                        {prayer.isNext &&
                          prayer.countdown &&
                          prayer.countdown !== "Passed" && (
                            <div className="space-y-2">
                              <p className="text-sm text-purple-600/70 font-medium">
                                الوقت المتبقي
                              </p>
                              <p className="text-2xl font-mono font-bold text-purple-600 bg-purple-100 px-4 py-2 rounded-lg inline-block">
                                {prayer.countdown}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Progress bar for next prayer */}
                    {prayer.isNext &&
                      prayer.countdown &&
                      prayer.countdown !== "Passed" && (
                        <div className="mt-4">
                          <div className="h-2 w-full bg-purple-200/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                              style={{
                                width: "100%",
                                animation: "shimmer 2s ease-in-out infinite",
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.01);
          }
        }

        @keyframes shimmer {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
