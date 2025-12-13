import { arabicTranslations } from "@/helpers/translation"
import { Card } from "./ui/card"

type AzkarItem = {
  id: string | number;
  title?: string;
  arabic_text?: string;
  translation?: string;
  [key: string]: unknown;
}

export function MoodAzkarList({ azkar }: { azkar: AzkarItem[] }) {
    if (!azkar.length) return null
  
    return (
      <div className="px-6 mt-6 animate-fadeIn" dir="rtl">
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-4 font-arabic">
          {arabicTranslations.recommendedForYou}
        </h3>
  
        <div className="space-y-4">
          {azkar.map((item) => (
            <Card key={item.id} className="bg-gradient-to-bl from-white to-indigo-50 dark:from-black/40 dark:to-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-md p-5">
              <p className="text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-2 font-arabic">{item.title}</p>
              <p className="text-2xl mb-2 text-gray-900 dark:text-gray-100 leading-relaxed font-arabic" dir="rtl">
                {item.arabic_text}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-arabic">{item.translation}</p>
            </Card>
          ))}
        </div>
      </div>
    )
  }