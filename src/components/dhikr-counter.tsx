"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Loader2, CheckCircle2, Circle, RotateCcw } from "lucide-react"
import { getAllAzkarGrouped, type GroupedAzkar, type DhikrRow } from "@/services/azkar"

type CategoryKey = "morning" | "afternoon" | "after_praying"

const categoryLabels: Record<CategoryKey, string> = {
  morning: "أذكار الصباح",
  afternoon: "أذكار المساء",
  after_praying: "أذكار بعد الصلاة",
}

type SessionState = Partial<
  Record<
    CategoryKey,
    {
      currentIndex: number
      counts: Record<string, number>
    }
  >
>

const SESSION_STORAGE_KEY = "adhkar-session-v1"
const categories: CategoryKey[] = ["morning", "afternoon", "after_praying"]

export default function DhikrCounter() {
  const [azkar, setAzkar] = useState<GroupedAzkar>({})
  const [sessionState, setSessionState] = useState<SessionState>({})
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("morning")
  const [loading, setLoading] = useState(true)
  const [celebrating, setCelebrating] = useState(false)
  const celebrationTimeout = useRef<NodeJS.Timeout | null>(null)

  // Load cached session on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          activeCategory?: CategoryKey
          progress?: SessionState
        }
        if (parsed.activeCategory && categories.includes(parsed.activeCategory)) {
          setActiveCategory(parsed.activeCategory)
        }
        if (parsed.progress) {
          setSessionState(parsed.progress)
        }
      } catch (error) {
        console.warn("Unable to restore prayer session:", error)
      }
    }
  }, [])

  // Fetch azkar lists
  useEffect(() => {
    async function loadData() {
      const data = await getAllAzkarGrouped()
      setAzkar(data)
      setLoading(false)
    }
    loadData()
  }, [])

  // Persist session whenever it changes
  useEffect(() => {
    if (loading || typeof window === "undefined") return
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        activeCategory,
        progress: sessionState,
      }),
    )
  }, [sessionState, activeCategory, loading])

  // Ensure each category has a session container when selected
  useEffect(() => {
    const currentList = azkar[activeCategory]
    if (!currentList || currentList.length === 0) return
    setSessionState((prev) => {
      if (prev[activeCategory]) return prev
      return {
        ...prev,
        [activeCategory]: {
          currentIndex: 0,
          counts: {},
        },
      }
    })
  }, [activeCategory, azkar])

  // Clamp the current index if the azkar list changed
  useEffect(() => {
    const listLength = azkar[activeCategory]?.length ?? 0
    if (listLength === 0) return
    setSessionState((prev) => {
      const categoryState = prev[activeCategory]
      if (!categoryState) return prev
      const maxIndex = Math.max(0, listLength - 1)
      if (categoryState.currentIndex <= maxIndex) return prev
      return {
        ...prev,
        [activeCategory]: {
          ...categoryState,
          currentIndex: maxIndex,
        },
      }
    })
  }, [activeCategory, azkar])

  useEffect(() => {
    return () => {
      if (celebrationTimeout.current) {
        clearTimeout(celebrationTimeout.current)
      }
    }
  }, [])

  const currentCategoryAzkar = useMemo(() => azkar[activeCategory] ?? [], [azkar, activeCategory])
  const categoryState = sessionState[activeCategory] ?? { currentIndex: 0, counts: {} }
  const totalSteps = currentCategoryAzkar.length
  const currentIndex = totalSteps === 0 ? 0 : Math.min(categoryState.currentIndex, totalSteps - 1)
  const currentDhikr: DhikrRow | null = currentCategoryAzkar[currentIndex] ?? null
  const currentCount = currentDhikr
    ? Math.min(categoryState.counts[currentDhikr.id] ?? 0, currentDhikr.count)
    : 0

  const completedSteps = useMemo(() => {
    return currentCategoryAzkar.reduce((completed, dhikr) => {
      const repetitions = categoryState.counts[dhikr.id] ?? 0
      return repetitions >= dhikr.count ? completed + 1 : completed
    }, 0)
  }, [currentCategoryAzkar, categoryState.counts])

  const sessionComplete = totalSteps > 0 && completedSteps === totalSteps
  const stepFraction =
    currentDhikr && currentDhikr.count > 0 ? Math.min(currentCount / currentDhikr.count, 1) : 0
  const sessionProgressValue =
    totalSteps === 0 ? 0 : sessionComplete ? 100 : ((completedSteps + stepFraction) / totalSteps) * 100

  const handleTap = () => {
    if (!currentDhikr || sessionComplete) return
    setSessionState((prev) => {
      const nextCategoryState = prev[activeCategory] ?? { currentIndex, counts: {} }
      const previousCount = nextCategoryState.counts[currentDhikr.id] ?? 0
      if (previousCount >= currentDhikr.count) {
        return prev
      }
      return {
        ...prev,
        [activeCategory]: {
          ...nextCategoryState,
          counts: {
            ...nextCategoryState.counts,
            [currentDhikr.id]: previousCount + 1,
          },
        },
      }
    })
  }

  const setCurrentIndex = useCallback(
    (nextIndex: number) => {
      setSessionState((prev) => {
        const currentState = prev[activeCategory] ?? { currentIndex: 0, counts: {} }
        if (currentState.currentIndex === nextIndex) return prev
        return {
          ...prev,
          [activeCategory]: {
            ...currentState,
            currentIndex: nextIndex,
          },
        }
      })
      setCelebrating(false)
    },
    [activeCategory],
  )

  const handleResetSession = () => {
    setSessionState((prev) => ({
      ...prev,
      [activeCategory]: {
        currentIndex: 0,
        counts: {},
      },
    }))
    setCelebrating(false)
  }

  const advanceToNextStep = useCallback(() => {
    if (totalSteps === 0) return
    setSessionState((prev) => {
      const currentState = prev[activeCategory]
      if (!currentState) return prev
      const nextIndex = Math.min(currentState.currentIndex + 1, totalSteps - 1)
      if (currentState.currentIndex === nextIndex) return prev
      return {
        ...prev,
        [activeCategory]: {
          ...currentState,
          currentIndex: nextIndex,
        },
      }
    })
  }, [activeCategory, totalSteps])

  useEffect(() => {
    if (!currentDhikr || currentDhikr.count === 0) return
    if (currentCount < currentDhikr.count) {
      setCelebrating(false)
      return
    }

    setCelebrating(true)

    if (currentIndex >= totalSteps - 1) {
      return
    }

    if (celebrationTimeout.current) {
      clearTimeout(celebrationTimeout.current)
    }

    celebrationTimeout.current = setTimeout(() => {
      setCelebrating(false)
      advanceToNextStep()
    }, 1100)

    return () => {
      if (celebrationTimeout.current) {
        clearTimeout(celebrationTimeout.current)
        celebrationTimeout.current = null
      }
    }
  }, [currentCount, currentDhikr, currentIndex, totalSteps, advanceToNextStep])

  useEffect(() => {
    if (sessionComplete) {
      setCelebrating(false)
    }
  }, [sessionComplete])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const tapDisabled = !currentDhikr || currentCount >= (currentDhikr?.count ?? 0) || sessionComplete

  return (
    <div className="p-4 pb-32 max-w-4xl mx-auto space-y-6">
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
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white shadow-lg shadow-purple-500/40 dark:shadow-purple-900/50 border-0"
                  : "bg-white/80 dark:bg-black/40 backdrop-blur-sm border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
              }`}
            >
              {categoryLabels[category]}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-0 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-2xl">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between text-sm uppercase tracking-wide font-semibold">
            <span>{totalSteps > 0 ? `الخطوة ${Math.min(currentIndex + 1, totalSteps)} من ${totalSteps}` : "لا يوجد جلسة"}</span>
            <span>{completedSteps} / {totalSteps || 0} اكتملت</span>
          </div>
          <Progress value={sessionProgressValue} className="bg-white/25 h-3" />
          <p className="text-xs text-white/80">
            تقدم الجلسة محفوظ تلقائياً، ويمكنك المتابعة من حيث توقفت في أي وقت.
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border border-purple-100/40 dark:border-white/5 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        <CardContent className="relative pt-6 space-y-6">
          {sessionComplete ? (
            <div className="text-center space-y-4 py-6">
              <Sparkles className="w-12 h-12 text-yellow-300 mx-auto animate-pulse" />
              <p className="text-2xl font-bold font-arabic text-purple-600 dark:text-purple-200">ما شاء الله! أنهيت الجلسة بالكامل</p>
              <p className="text-sm text-muted-foreground">يمكنك إعادة الجلسة أو مراجعة الأذكار أدناه.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="secondary" onClick={handleResetSession}>
                  <RotateCcw className="size-4" />
                  إعادة الجلسة
                </Button>
              </div>
            </div>
          ) : currentDhikr ? (
            <>
              <div className="text-center space-y-3">
                {currentDhikr.title && (
                  <p className="text-sm uppercase tracking-wide text-purple-500 dark:text-purple-300 font-semibold">
                    {currentDhikr.title}
                  </p>
                )}
                <p className="text-3xl md:text-4xl font-arabic leading-relaxed text-foreground">
                  {currentDhikr.text}
                </p>
                {currentDhikr.transliteration && (
                  <p className="text-sm text-muted-foreground">{currentDhikr.transliteration}</p>
                )}
                {currentDhikr.meaning && (
                  <p className="text-xs text-muted-foreground/90">{currentDhikr.meaning}</p>
                )}
                {currentDhikr.bless && (
                  <div className="mt-3 p-4 rounded-2xl bg-purple-50 dark:bg-white/5 border border-purple-100/80 dark:border-white/10 text-sm font-arabic text-purple-900 dark:text-purple-100">
                    {currentDhikr.bless}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground uppercase tracking-wide font-semibold">
                  عدّ الذكر الحالي
                </p>
                <button
                  type="button"
                  onClick={handleTap}
                  disabled={tapDisabled}
                  aria-label="اضغط للتسبيح"
                  className={`relative w-full rounded-3xl border-2 border-dashed border-purple-200 dark:border-white/10 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-white/5 dark:via-purple-900/20 dark:to-slate-900 px-6 pt-10 pb-16 shadow-inner transition-all duration-300 focus-visible:ring-4 focus-visible:ring-purple-300/60 disabled:opacity-70 disabled:cursor-not-allowed min-h-[240px]`}
                >
                  <span className="block text-center text-7xl md:text-8xl font-mono font-bold text-purple-600 dark:text-purple-200 drop-shadow-sm">
                    {currentCount}
                  </span>
                  <span className="block mt-2 text-lg font-semibold text-purple-800 dark:text-purple-100">
                    من <span className="font-arabic">{currentDhikr.count}</span>
                  </span>
                  <span className="absolute bottom-6 left-6 right-6 text-center text-sm font-semibold text-purple-500/80 dark:text-purple-200/80 tracking-widest uppercase">
                    اضغط في أي مكان للعدّ
                  </span>
                  {celebrating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/30 backdrop-blur-sm rounded-3xl animate-fadeIn">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-14 h-14 text-emerald-500 drop-shadow-lg" />
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-300 font-arabic">تم إكمال الذكر</p>
                      </div>
                    </div>
                  )}
                </button>
                <Progress value={stepFraction * 100} className="h-2 rounded-full bg-muted" />
                <p className="text-center text-sm text-muted-foreground">
                  {Math.round(stepFraction * 100)}% من الذكر الحالي
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" onClick={handleResetSession}>
                  <RotateCcw className="size-4" />
                  تصفير الجلسة
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              لا توجد أذكار متاحة لهذه الفئة حالياً.
            </div>
          )}
        </CardContent>
      </Card>

      {totalSteps > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground font-arabic">
            قائمة الأذكار ({categoryLabels[activeCategory]})
          </h2>
          <div className="space-y-2">
            {currentCategoryAzkar.map((dhikr, index) => {
              const dhikrCount = categoryState.counts[dhikr.id] ?? 0
              const completed = dhikrCount >= dhikr.count
              const isCurrent = index === currentIndex && !sessionComplete

              return (
                <button
                  key={dhikr.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 min-h-[44px] ${
                    completed
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-900/20"
                      : isCurrent
                        ? "border-purple-300 bg-purple-50/80 dark:bg-purple-900/20 dark:border-purple-500/40"
                        : "border-transparent bg-white/80 dark:bg-white/5 hover:border-purple-200 dark:hover:border-purple-800/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-purple-300 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`font-arabic text-lg leading-relaxed ${completed ? "text-emerald-800 dark:text-emerald-200" : "text-foreground"}`}>
                        {dhikr.text}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="font-semibold px-3 py-1 rounded-full bg-purple-100/60 dark:bg-purple-900/20">
                          {dhikrCount}/{dhikr.count}
                        </span>
                        {dhikr.bless && <span className="font-arabic">{dhikr.bless}</span>}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
