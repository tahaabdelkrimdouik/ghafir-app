import { useState, useEffect, useCallback } from 'react';

export type DhikrProgress = {
  id: string;
  count: number;
  completed: boolean;
  lastUpdated: string; // YYYY-MM-DD format
};

const STORAGE_KEY = 'dhikr-progress-v1';

export const useDhikr = (categoryId: string, targetCount: number) => {
  const [progress, setProgress] = useState<DhikrProgress>({
    id: categoryId,
    count: 0,
    completed: false,
    lastUpdated: new Date().toISOString().split('T')[0],
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allProgress: Record<string, DhikrProgress> = JSON.parse(stored);
        const categoryProgress = allProgress[categoryId];

        if (categoryProgress) {
          const today = getTodayDate();
          // Check if lastUpdated is different from today
          if (categoryProgress.lastUpdated !== today) {
            // Reset for new day
            const resetProgress: DhikrProgress = {
              id: categoryId,
              count: 0,
              completed: false,
              lastUpdated: today,
            };
            setProgress(resetProgress);
            // Update localStorage
            const updated = { ...allProgress, [categoryId]: resetProgress };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } else {
            // Same day, restore progress
            setProgress(categoryProgress);
          }
        } else {
          // No stored data for this category, initialize
          const newProgress: DhikrProgress = {
            id: categoryId,
            count: 0,
            completed: false,
            lastUpdated: getTodayDate(),
          };
          setProgress(newProgress);
        }
      } else {
        // No stored data at all, initialize
        const newProgress: DhikrProgress = {
          id: categoryId,
          count: 0,
          completed: false,
          lastUpdated: getTodayDate(),
        };
        setProgress(newProgress);
      }
    } catch (error) {
      console.error('Error loading dhikr progress:', error);
      // Initialize with default values
      setProgress({
        id: categoryId,
        count: 0,
        completed: false,
        lastUpdated: getTodayDate(),
      });
    }
  }, [categoryId, getTodayDate]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allProgress: Record<string, DhikrProgress> = stored ? JSON.parse(stored) : {};
      allProgress[categoryId] = progress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving dhikr progress:', error);
    }
  }, [categoryId, progress]);

  // Check daily reset on mount and when date might change
  useEffect(() => {
    const checkDailyReset = () => {
      const today = getTodayDate();
      if (progress.lastUpdated !== today) {
        setProgress({
          id: categoryId,
          count: 0,
          completed: false,
          lastUpdated: today,
        });
      }
    };

    // Check immediately
    checkDailyReset();

    // Check every minute to catch date changes
    const interval = setInterval(checkDailyReset, 60000);

    return () => clearInterval(interval);
  }, [categoryId, progress.lastUpdated, getTodayDate]);

  const increment = useCallback(() => {
    setProgress((prev) => {
      if (prev.completed) return prev;
      const newCount = Math.min(prev.count + 1, targetCount);
      return {
        ...prev,
        count: newCount,
        completed: newCount >= targetCount,
        lastUpdated: getTodayDate(),
      };
    });
  }, [targetCount, getTodayDate]);

  const reset = useCallback(() => {
    setProgress({
      id: categoryId,
      count: 0,
      completed: false,
      lastUpdated: getTodayDate(),
    });
  }, [categoryId, getTodayDate]);

  return {
    progress,
    increment,
    reset,
  };
};

