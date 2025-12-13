"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type AyahData = {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
  };
  numberInSurah: number;
};

const CACHE_KEY = "daily_ayah";
const CACHE_DATE_KEY = "daily_ayah_date";

export default function RandomAyahCard() {
  const [ayah, setAyah] = useState<AyahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const fetchRandomAyah = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API
      const response = await fetch("https://api.alquran.cloud/v1/ayah/random");
      
      if (!response.ok) {
        throw new Error("Failed to fetch Ayah");
      }

      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        const ayahData: AyahData = {
          number: data.data.number,
          text: data.data.text,
          surah: {
            number: data.data.surah.number,
            name: data.data.surah.name,
            englishName: data.data.surah.englishName,
            englishNameTranslation: data.data.surah.englishNameTranslation,
          },
          numberInSurah: data.data.numberInSurah,
        };

        // Cache the Ayah with today's date
        localStorage.setItem(CACHE_KEY, JSON.stringify(ayahData));
        localStorage.setItem(CACHE_DATE_KEY, getTodayDateString());

        setAyah(ayahData);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (err) {
      console.error("Error fetching Ayah:", err);
      setError("فشل تحميل الآية. يرجى المحاولة مرة أخرى.");
      
      // Try to use cached data even if it's from a previous day
      const cachedAyah = localStorage.getItem(CACHE_KEY);
      if (cachedAyah) {
        try {
          setAyah(JSON.parse(cachedAyah));
        } catch (e) {
          console.error("Error parsing cached Ayah:", e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = getTodayDateString();
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
    const cachedAyah = localStorage.getItem(CACHE_KEY);

    // Check if we have a cached Ayah for today
    if (cachedDate === today && cachedAyah) {
      try {
        setAyah(JSON.parse(cachedAyah));
        setLoading(false);
        return;
      } catch (e) {
        console.error("Error parsing cached Ayah:", e);
        // If parsing fails, fetch a new one
      }
    }

    // Fetch new Ayah if no cache or cache is from a different day
    fetchRandomAyah();
  }, []);

  if (loading && !ayah) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
            <p className="text-indigo-600 dark:text-indigo-400 font-arabic">جاري تحميل الآية...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error && !ayah) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 font-arabic text-center">{error}</p>
        </Card>
      </div>
    );
  }

  if (!ayah) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border-indigo-200 dark:border-indigo-800 shadow-lg">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 font-arabic mb-1">
              آية اليوم
            </h3>
            <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70 font-arabic">
              {ayah.surah.name} - {ayah.surah.englishNameTranslation}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              سورة {ayah.surah.englishName} - آية {ayah.numberInSurah}
            </p>
          </div>

          {/* Arabic Text */}
          <div className="text-center py-4">
            <p className="text-3xl md:text-4xl font-arabic text-gray-900 dark:text-gray-100 leading-relaxed mb-4">
              {ayah.text}
            </p>
          </div>

          {/* Translation */}
          <div className="text-center pt-4 border-t border-indigo-200/50 dark:border-indigo-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              {ayah.surah.englishNameTranslation} {ayah.surah.number}:{ayah.numberInSurah}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

