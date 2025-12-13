"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Plus, Loader2 } from "lucide-react"
import { getAllAzkarGrouped, type GroupedAzkar, type DhikrRow } from "@/services/azkar"

type CategoryKey = "morning" | "afternoon" | "after_praying"

const categoryLabels: Record<CategoryKey, string> = {
  morning: "أذكار الصباح",
  afternoon: "أذكار المساء",
  after_praying: "أذكار بعد الصلاة",
}

export default function DhikrCounter() {
  const [azkar, setAzkar] = useState<GroupedAzkar>({})
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("morning")
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrRow | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    async function loadData() {
      const data = await getAllAzkarGrouped()
      setAzkar(data)
      // Set first dhikr of morning as selected by default
      if (data.morning && data.morning.length > 0) {
        setSelectedDhikr(data.morning[0])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleIncrement = () => {
    if (!selectedDhikr) return
    setCount((prev) => prev + 1)
  }

  const handleReset = () => {
    setCount(0)
  }

  const handleDhikrSelect = (dhikr: DhikrRow) => {
    setSelectedDhikr(dhikr)
    setCount(0)
  }

  const progress = selectedDhikr ? Math.min((count / selectedDhikr.count) * 100, 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const categories: CategoryKey[] = ["morning", "afternoon", "after_praying"]
  const currentCategoryAzkar = azkar[activeCategory] || []

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              className={`font-arabic text-sm whitespace-nowrap transition-all ${
                activeCategory === category
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white shadow-lg shadow-purple-500/50 dark:shadow-purple-900/50 border-0"
                  : "bg-white/80 dark:bg-black/40 backdrop-blur-sm border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
              }`}
            >
              {categoryLabels[category]}
            </Button>
          ))}
        </div>
      </div>

      {/* Counter Display */}
      {selectedDhikr && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-900 border-0 shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-purple-200 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300 dark:bg-purple-400 rounded-full blur-3xl" />
          </div>

          <CardContent className="relative pt-6 space-y-6">
            {/* Arabic Text */}
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-arabic text-white mb-2 leading-relaxed drop-shadow-lg">
                {selectedDhikr.text}
              </p>
              {selectedDhikr.transliteration && (
                <p className="text-sm text-white/90 mt-3">{selectedDhikr.transliteration}</p>
              )}
              {selectedDhikr.meaning && <p className="text-xs text-white/80 mt-1">{selectedDhikr.meaning}</p>}
              {selectedDhikr.bless && (
                <div className="mt-4 p-3 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-lg border border-white/30 dark:border-white/10 shadow-lg">
                  <p className="text-xs  font-arabic text-white/95 dark:text-white/90 leading-relaxed">{selectedDhikr.bless}</p>
                </div>
              )}
            </div>

            {/* Count Display */}
            <div className="text-center py-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full animate-pulse" />
                <p className="relative text-7xl md:text-8xl font-bold text-white font-mono drop-shadow-2xl">{count}</p>
              </div>
              <p className="text-white/90 mt-4 text-lg">
                من <span className="font-semibold text-white font-arabic">{selectedDhikr.count}</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-4 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden border border-white/30">
                <div
                  className="h-full bg-gradient-to-r from-white to-pink-200 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                </div>
              </div>
              <p className="text-center text-sm text-white/90 font-semibold">{Math.round(progress)}%</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="flex-1 bg-white/20 dark:bg-black/40 backdrop-blur-sm text-white border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/50 transition-all shadow-lg"
              >
                <RotateCcw size={20} />
                إعادة
              </Button>
              <Button
                onClick={handleIncrement}
                size="lg"
                className="flex-[2] text-lg font-semibold bg-white dark:bg-gray-100 text-purple-600 dark:text-purple-700 hover:bg-white/90 dark:hover:bg-gray-200 shadow-xl hover:scale-105 transition-transform"
              >
                <Plus size={24} />
                عد
              </Button>
            </div>

            {/* Completion Message */}
            {count >= selectedDhikr.count && (
              <div className="text-center p-4 bg-white/25 dark:bg-black/40 backdrop-blur-md rounded-lg border border-white/40 dark:border-white/10 shadow-lg animate-pulse">
                <p className="text-white font-bold text-lg font-arabic drop-shadow-md">✨ تم إكمال العدد! ✨</p>
                <p className="text-sm text-white/90 mt-1 font-arabic">تقبل الله منك</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Azkar List for Current Category */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground font-arabic">{categoryLabels[activeCategory]}</h2>
        <div className="space-y-2">
          {currentCategoryAzkar.map((dhikr) => (
            <button
              key={dhikr.id}
              onClick={() => handleDhikrSelect(dhikr)}
              className={`w-full p-4 rounded-xl border transition-all transform hover:scale-[1.02] ${
                selectedDhikr?.id === dhikr.id
                  ? "bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white border-0 shadow-xl shadow-purple-500/50 dark:shadow-purple-900/50"
                  : "bg-white/80 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:border-purple-200 dark:hover:border-purple-700 shadow-md"
              }`}
            >
              {dhikr.title && (
                <p
                  className={`text-xs font-semibold mb-2 font-arabic ${selectedDhikr?.id === dhikr.id ? "text-white/90" : "text-purple-700 dark:text-purple-300"}`}
                >
                  {dhikr.title}
                </p>
              )}
              <p
                className={`text-lg md:text-xl font-arabic leading-relaxed mb-2 ${selectedDhikr?.id === dhikr.id ? "text-white" : "text-gray-800 dark:text-gray-200"}`}
              >
                {dhikr.text}
              </p>
              {dhikr.transliteration && (
                <p
                  className={`text-xs text-left mt-2 ${selectedDhikr?.id === dhikr.id ? "text-white/80" : "text-gray-600 dark:text-gray-400"}`}
                >
                  {dhikr.transliteration}
                </p>
              )}
              {dhikr.meaning && (
                <p
                  className={`text-xs text-left mt-1 ${selectedDhikr?.id === dhikr.id ? "text-white/75" : "text-gray-500 dark:text-gray-500"}`}
                >
                  {dhikr.meaning}
                </p>
              )}
              <div className="flex items-center justify-between mt-3">

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    selectedDhikr?.id === dhikr.id
                      ? "bg-white/25 dark:bg-black/40 backdrop-blur-sm text-white"
                      : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                  }`}
                >
                  {dhikr.count}×
                </span>
                                {dhikr.bless && (
                  <p
                    className={`text-xs flex-1 font-arabic ${selectedDhikr?.id === dhikr.id ? "text-white/85" : "text-gray-600"}`}
                  >
                    {dhikr.bless}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
