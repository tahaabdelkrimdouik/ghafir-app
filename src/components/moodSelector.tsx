import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { Loader2 } from "lucide-react"
import { arabicTranslations } from "@/helpers/translation"

// Define the mood type to match your database categories
type Mood = "anxiety" | "grateful" | "sad"

// Define the azkar item type
type AzkarItem = {
  id: string | number;
  title?: string;
  arabic_text?: string;
  translation?: string;
  [key: string]: unknown;
}

export function MoodSelector({
  onAzkarLoaded
}: {
  onAzkarLoaded: (list: AzkarItem[]) => void
}) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectMood = async (mood: Mood) => {
    setSelectedMood(mood)
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from("dhikr")
        .select("*")
        .eq("category", mood)

      if (error) {
        console.error("Supabase error:", error)
        onAzkarLoaded([]) // Send empty array on error
        return
      }

      // Send the list back to parent component
      onAzkarLoaded(data || [])
    } catch (error) {
      console.error("Error fetching azkar:", error)
      onAzkarLoaded([]) // Send empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Define the mood options with their corresponding Mood type and Arabic labels
  const moodOptions = [
    { type: "anxiety" as Mood, emoji: "😰", label: arabicTranslations.anxious },
    { type: "grateful" as Mood, emoji: "😌", label: arabicTranslations.grateful },
    { type: "sad" as Mood, emoji: "😔", label: arabicTranslations.sad },
  ]

  return (
    <div className="px-6 mt-6" dir="rtl">
      <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-4 font-arabic">
        {arabicTranslations.howAreYouFeeling}
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide justify-end" dir="ltr">
        {moodOptions.map((mood) => (
          <Button
            key={mood.label}
            variant="outline"
            onClick={() => handleSelectMood(mood.type)}
            disabled={loading}
            className={`
              flex items-center gap-2 
              rounded-full px-6 py-5 
              bg-white dark:bg-black/40 border-2 
              shadow-sm transition-all 
              whitespace-nowrap min-w-[120px]
              ${selectedMood === mood.type
                ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-500 shadow-md text-indigo-700 dark:text-indigo-300"
                : "border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-300"
              }
              ${loading ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="font-medium font-arabic">{mood.label}</span>
          </Button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 mt-4 text-indigo-600 dark:text-indigo-400" dir="rtl">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm font-medium font-arabic">{arabicTranslations.loadingAzkar}</p>
        </div>
      )}

    </div>
  )
}