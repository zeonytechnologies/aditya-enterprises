const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envStr = fs.readFileSync(envPath, 'utf8');
const VITE_SUPABASE_URL = envStr.match(/VITE_SUPABASE_URL=(.*)/)?.[1];
const VITE_SUPABASE_ANON_KEY = envStr.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1];
const SUPABASE_SERVICE_ROLE_KEY = envStr.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1];

// Get credentials from .env
const supabaseUrl = VITE_SUPABASE_URL;
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const imgDir = 'd:\\ZEONY\\ADITYA ENTERPRISES\\83 images';
const brand_id = '1c47ce63-428d-49a5-83ca-e3a2b063ef39';

async function main() {
  const files = fs.readdirSync(imgDir);
  let updatedCount = 0;
  
  // First, check if 'product-images' bucket exists, if not, try to create or just use 'images'
  const { data: buckets } = await supabase.storage.listBuckets();
  let useBucket = 'product-images';
  
  if (buckets && buckets.find(b => b.name === 'product-images')) {
      useBucket = 'product-images';
  } else if (buckets && buckets.find(b => b.name === 'products')) {
      useBucket = 'products';
  } else {
      // create product-images bucket
      await supabase.storage.createBucket('product-images', { public: true });
  }
  
  console.log('Using bucket:', useBucket);
  
  for (const file of files) {
    if (!file.endsWith('.jpg') && !file.endsWith('.png') && !file.endsWith('.jpeg')) continue;
    
    const filePath = path.join(imgDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(file).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    
    // Upload path in bucket
    const uploadPath = `mapei/${file}`;
    
    console.log(`Uploading ${file}...`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(useBucket)
      .upload(uploadPath, fileBuffer, {
        contentType: mimeType,
        upsert: true
      });
      
    if (uploadError) {
      console.error(`Error uploading ${file}:`, uploadError.message);
      continue;
    }
    
    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(useBucket)
      .getPublicUrl(uploadPath);
      
    console.log(`Uploaded to: ${publicUrl}`);
    
    // Update Database
    const name = path.basename(file, path.extname(file));
    
    const { data: updateData, error: updateError } = await supabase
      .from('products')
      .update({ images: [publicUrl] })
      .ilike('name', `%${name}%`) // Use ilike in case of slight mismatches
      .eq('brand_id', brand_id)
      .select();
      
    if (updateError) {
      console.error(`Error updating DB for ${name}:`, updateError.message);
    } else if (updateData && updateData.length > 0) {
      console.log(`Updated product: ${updateData[0].name}`);
      updatedCount++;
    } else {
      console.log(`No product found to update for: ${name}`);
    }
  }
  
  console.log(`Finished. Successfully updated ${updatedCount} products.`);
}

main().catch(console.error);
