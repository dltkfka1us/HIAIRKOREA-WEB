const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually to avoid dotenv dependency
const envPath = path.join(__dirname, '..', '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log('Starting data migration...');

  try {
    // 1. Config 데이터 삽입
    const configPath = path.join(__dirname, '..', 'migrate_config.json');
    if (fs.existsSync(configPath)) {
      const configDataRaw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const configData = configDataRaw.filter(item => item.key !== 'nan' && item.key !== null);
      
      const { data, error } = await supabase.from('app_config').insert(configData);
      if (error) {
        console.error('Error inserting Config:', error);
      } else {
        console.log(`Successfully inserted ${configData.length} records into app_config.`);
      }
    }

    // 2. Edu_DB 데이터 삽입 (이미 완료됨)
    // const eduPath = path.join(__dirname, '..', 'migrate_edu.json');
    // ...

    // 3. Kosha 데이터 삽입
    const koshaPath = path.join(__dirname, '..', 'migrate_kosha.json');
    if (fs.existsSync(koshaPath)) {
      const koshaData = JSON.parse(fs.readFileSync(koshaPath, 'utf8'));
      
      const chunkSize = 50;
      for (let i = 0; i < koshaData.length; i += chunkSize) {
        const chunk = koshaData.slice(i, i + chunkSize);
        // UPSERT 로직 (kosha_id 중복 방지)
        const { error } = await supabase.from('accident_news').upsert(chunk, { onConflict: 'kosha_id' });
        if (error) {
          console.error(`Error inserting Kosha chunk ${i}:`, error);
        }
      }
      console.log(`Successfully inserted ${koshaData.length} records into accident_news.`);
    }

    console.log('Migration completed!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

migrateData();
