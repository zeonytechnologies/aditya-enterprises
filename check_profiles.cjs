const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uubsvvnxnmhtddnptqsm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YnN2dm54bm1odGRkbnB0cXNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDAxNDI2NywiZXhwIjoyMDk5NTkwMjY3fQ.sJ3eG8bq5x_XCHgBrbUzdbRQgUYGnNrVCUw6WFWkGyk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('profiles').select('id, full_name, role');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
run();
