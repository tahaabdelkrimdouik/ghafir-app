// 1. Define the shape of a single row from the JSON files
export interface DhikrRow {
  id: string;
  category: 'morning' | 'afternoon' | 'after_praying' | 'anxiety' | 'grateful' | 'sad' | 'common' | 'night';
  text: string;         // The main Arabic text
  count: number;        // The target repeat count
  title?: string;       // Optional title
  bless?: string;       // Optional benefit/virtue
  transliteration?: string; // For common dhikr
  meaning?: string;         // For common dhikr
}

// 2. Define the shape of the Grouped Object
export interface GroupedAzkar {
  [category: string]: DhikrRow[];
}

// 3. The Function to Fetch and Group from JSON files
export async function getAllAzkarGrouped(): Promise<GroupedAzkar> {
  const groupedData: GroupedAzkar = {};

  // List of azkar files to load
  const azkarFiles = [
    'morning',
    'afternoon',
    'after-prayer',
    'anxiety',
    'grateful',
    'sad'
  ];

  try {
    for (const fileName of azkarFiles) {
      const response = await fetch(`/azkar/${fileName}.json`);
      if (!response.ok) {
        console.error(`Failed to load ${fileName}.json:`, response.statusText);
        continue;
      }

      const jsonData = await response.json();
      const category = fileName === 'after-prayer' ? 'after_praying' : fileName;

      if (!groupedData[category]) {
        groupedData[category] = [];
      }

      // Convert JSON structure to DhikrRow format
      jsonData.content.forEach((item: any, index: number) => {
        groupedData[category].push({
          id: `${category}_${index}`,
          category: category as DhikrRow['category'],
          text: item.zekr,
          count: item.repeat,
          title: jsonData.title,
          bless: item.bless || undefined,
        });
      });
    }
  } catch (error) {
    console.error('Error loading azkar data:', error);
    return {};
  }

  return groupedData;
}