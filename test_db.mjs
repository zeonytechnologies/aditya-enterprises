
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubsvvnxnmhtddnptqsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YnN2dm54bm1odGRkbnB0cXNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDAxNDI2NywiZXhwIjoyMDk5NTkwMjY3fQ.sJ3eG8bq5x_XCHgBrbUzdbRQgUYGnNrVCUw6WFWkGyk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const banner = {
    image_url: 'https://example.com/test.png',
    link_url: 'https://example.com'
  };
  const { data, error } = await supabase.from('home_banners').insert(banner).select().single();
  if (error) {
    console.error('DB Error:', error);
  } else {
    console.log('Success inserted banner:', data);
    
    // cleanup
    await supabase.from('home_banners').delete().eq('id', data.id);
    console.log('Cleanup complete');
  }
}

run();

