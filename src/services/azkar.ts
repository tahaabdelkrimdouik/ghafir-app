import { supabase } from '../lib/supabaseClient';

// 1. Define the shape of a single row from the DB
export interface DhikrRow {
  id: string;
  category: 'morning' | 'afternoon' | 'after_praying' | 'common' | 'night';
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

// 3. The Function to Fetch and Group
export async function getAllAzkarGrouped(): Promise<GroupedAzkar> {
  // A. Fetch all rows from Supabase
  const { data, error } = await supabase
    .from('dhikr')
    .select('*')
    .order('id', { ascending: true }); // Keeps them in consistent order

  if (error) {
    console.error('Error fetching all azkar:', error);
    return {};
  }

  if (!data) return {};

  // B. Group them by category using .reduce()
  const groupedData = data.reduce((acc: GroupedAzkar, item: DhikrRow) => {
    // If this category doesn't exist in our object yet, create an empty array
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    
    // Push the item into the correct category array
    acc[item.category].push(item);
    
    return acc;
  }, {});

  return groupedData;
}