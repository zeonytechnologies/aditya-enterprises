
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubsvvnxnmhtddnptqsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YnN2dm54bm1odGRkbnB0cXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMTQyNjcsImV4cCI6MjA5OTU5MDI2N30.X7RoCbEVNPxcAW269pdrWUSy7OtNvyAbm7Jlte3L3xk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const fileContent = new Blob(['fake image data'], { type: 'image/png' });
  const { data, error } = await supabase.storage
    .from('aditya-assets')
    .upload('posters/test_anon.png', fileContent, {
      contentType: 'image/png',
      upsert: true
    });
    
  if (error) {
    console.error('Storage Error:', error);
  } else {
    console.log('Success:', data);
  }
}

run();

