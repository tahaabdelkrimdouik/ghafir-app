import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION CHECKS ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing .env variables!');
  console.error(`URL: ${supabaseUrl ? 'Found' : 'Missing'}`);
  console.error(`KEY: ${supabaseKey ? 'Found' : 'Missing'}`);
  process.exit(1);
}

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

interface AzkarItem {
  zekr: string;
  repeat: number;
  bless?: string;
}

interface AzkarJSON {
  title: string;
  content: AzkarItem[];
}

const AZKAR_FOLDER = path.join(__dirname, '../azkar');

function getCategory(fileName: string) {
  if (fileName.includes('morning')) return 'morning';
  if (fileName.includes('afternoon')) return 'afternoon';
  if (fileName.includes('after-prayer')) return 'after praying';
  if (fileName.includes('anxiety')) return 'anxiety';
  if (fileName.includes('grateful')) return 'grateful';
  if (fileName.includes('sad')) return 'sad';
  return 'general';
}

async function importFile(filePath: string) {
  console.log(`\n📂 Reading file: ${path.basename(filePath)}...`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json: AzkarJSON = JSON.parse(raw);
  const category = getCategory(filePath);

  console.log(`   🏷️  Category detected: "${category}"`);
  console.log(`   🔢 Items found: ${json.content.length}`);

  for (const [index, item] of json.content.entries()) {
    const { zekr, repeat, bless } = item;
    
    // TRUNCATE ZEKR FOR LOGGING
    const zekrSnippet = zekr.substring(0, 30) + '...';

    // 1. DUPLICATE CHECK
    const { data: existing, error: selectError } = await supabase
      .from('dhikr')
      .select('id')
      .eq('text', zekr) 
      .eq('category', category); // Check specifically in this category

    if (selectError) {
      console.error(`   ❌ Select Error for item ${index}:`, selectError.message);
      continue;
    }

    if (existing && existing.length > 0) {
      console.log(`   ⏭️  Skipping duplicate: ${zekrSnippet}`);
      continue;
    }

    // 2. INSERT ATTEMPT
    const payload = {
      category,
      title: json.title,
      text: zekr,
      arabic_text: zekr,
      count: repeat,
      bless: bless || "", // Ensure it's not undefined
    };

    const { error: insertError } = await supabase.from('dhikr').insert([payload]);

    if (insertError) {
      console.error(`   🛑 INSERT FAILED item ${index}:`);
      console.error(`      Reason: ${insertError.message}`);
      console.error(`      Hint: ${insertError.hint || 'No hint'}`);
      console.error(`      Details: ${insertError.details || 'No details'}`);
    } else {
      console.log(`   ✅ Inserted: ${zekrSnippet}`);
    }
  }
}

async function importAll() {
  try {
    const files = fs.readdirSync(AZKAR_FOLDER).filter((f: string) => f.endsWith('.json'));
    
    if (files.length === 0) {
      console.warn('⚠️ No JSON files found in folder!');
      return;
    }

    for (const file of files) {
      await importFile(path.join(AZKAR_FOLDER, file));
    }
    console.log('\n🎉 Finished importing.');
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

importAll();