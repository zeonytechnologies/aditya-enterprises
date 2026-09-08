const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envStr = fs.readFileSync(envPath, 'utf8');
const VITE_SUPABASE_URL = envStr.match(/VITE_SUPABASE_URL=(.*)/)?.[1];
const VITE_SUPABASE_ANON_KEY = envStr.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1];
const SUPABASE_SERVICE_ROLE_KEY = envStr.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1];

const supabaseUrl = VITE_SUPABASE_URL;
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const directoriesToProcess = [
  'd:\\\\ZEONY\\\\ADITYA ENTERPRISES\\\\88 Images Pidilite',
  'd:\\\\ZEONY\\\\ADITYA ENTERPRISES\\\\88 Images Pidilite - Copy',
  'd:\\\\ZEONY\\\\ADITYA ENTERPRISES\\\\83 images' // Add Mapei images folder just in case
];

async function main() {
  let updatedCount = 0;
  
  // First, check if 'product-images' bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  let useBucket = 'product-images';
  
  if (buckets && buckets.find(b => b.name === 'product-images')) {
      useBucket = 'product-images';
  } else if (buckets && buckets.find(b => b.name === 'products')) {
      useBucket = 'products';
  } else {
      await supabase.storage.createBucket('product-images', { public: true });
  }
  
  console.log('Using bucket:', useBucket);
  
  for (const imgDir of directoriesToProcess) {
    if (!fs.existsSync(imgDir)) {
      console.log(`Skipping missing directory: ${imgDir}`);
      continue;
    }
    console.log(`\nProcessing directory: ${imgDir}`);
    const files = fs.readdirSync(imgDir);

    for (const file of files) {
      if (!file.endsWith('.jpg') && !file.endsWith('.png') && !file.endsWith('.jpeg')) continue;
      
      const filePath = path.join(imgDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(file).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
      
      const uploadPath = `bulk_upload/${file}`;
      
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
      
      const { data: { publicUrl } } = supabase.storage
        .from(useBucket)
        .getPublicUrl(uploadPath);
        
      // Match Product
      const name = path.basename(file, path.extname(file)).trim();
      
      // First try an exact match (case insensitive)
      let { data: products, error: findError } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', name);
        
      if (!products || products.length === 0) {
        // If not found, try a wildcard match
        let wildcardName = name.replace(/ /g, '%');
        let { data: wildcardProducts } = await supabase
          .from('products')
          .select('id, name')
          .ilike('name', `%${wildcardName}%`);
          
        if (wildcardProducts && wildcardProducts.length > 0) {
            products = wildcardProducts;
        }
      }
        
      if (findError) {
        console.error(`Error finding DB record for ${name}:`, findError.message);
      } else if (products && products.length > 0) {
        const product = products[0]; // Take the first match
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ images: [publicUrl] })
          .eq('id', product.id);
          
        if (updateError) {
            console.error(`Error updating DB for ${name}:`, updateError.message);
        } else {
            console.log(`✅ Updated product: ${product.name} (Matched to file ${file})`);
            updatedCount++;
        }
      } else {
        console.log(`❌ No product found in DB to match file: ${file}`);
      }
    }
  }
  
  console.log(`\nFinished. Successfully updated ${updatedCount} products across all folders.`);
}

main().catch(console.error);
