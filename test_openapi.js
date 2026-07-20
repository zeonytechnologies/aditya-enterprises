import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://uubsvvnxnmhtddnptqsm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YnN2dm54bm1odGRkbnB0cXNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDAxNDI2NywiZXhwIjoyMDk5NTkwMjY3fQ.sJ3eG8bq5x_XCHgBrbUzdbRQgUYGnNrVCUw6WFWkGyk');
async function test() {
  const res = await fetch('https://uubsvvnxnmhtddnptqsm.supabase.co/rest/v1/', {
    headers: { 'apikey': supabase.supabaseKey }
  });
  const openapi = await res.json();
  console.log(Object.keys(openapi.definitions.orders.properties));
}
test();
