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

// PUT ALL YOUR IMAGES IN THIS FOLDER:
const imgDir = 'd:\\\\ZEONY\\\\ADITYA ENTERPRISES\\\\All_Images';

async function main() {
  if (!fs.existsSync(imgDir)) {
      console.log(`\n❌ ERROR: Folder not found! Please create a folder named "All_Images" in your project and put all your images inside it.`);
      console.log(`Expected path: ${imgDir}\n`);
      return;
  }

  const { data: buckets } = await supabase.storage.listBuckets();
  let useBucket = 'products'; // We will use 'products' to match your old setup exactly
  
  if (!buckets || !buckets.find(b => b.name === 'products')) {
      await supabase.storage.createBucket('products', { public: true });
  }
  
  console.log(`\n🚀 Starting upload. Reading images from: ${imgDir}\n`);
  const files = fs.readdirSync(imgDir);
  let updatedCount = 0;

  for (const file of files) {
    if (!file.endsWith('.jpg') && !file.endsWith('.png') && !file.endsWith('.jpeg') && !file.endsWith('.webp')) continue;
    
    const filePath = path.join(imgDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(file).toLowerCase();
    
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    if (ext === '.webp') mimeType = 'image/webp';
    
    const name = path.basename(file, ext).trim();
    
    // 1. Find the product and its brand in the database
    let { data: products } = await supabase
      .from('products')
      .select('id, name, brand:brand_id(slug)')
      .ilike('name', name);
      
    // Try flexible match if exact match fails
    if (!products || products.length === 0) {
      let wildcardName = name.replace(/ /g, '%');
      let { data: wildcardProducts } = await supabase
        .from('products')
        .select('id, name, brand:brand_id(slug)')
        .ilike('name', `%${wildcardName}%`);
        
      if (wildcardProducts && wildcardProducts.length > 0) {
          products = wildcardProducts;
      }
    }

    if (!products || products.length === 0) {
      console.log(`⚠️ Skipped: "${file}" - Could not find a matching product in database.`);
      continue;
    }

    const product = products[0];
    const brandSlug = product.brand ? product.brand.slug : 'other';
    
    // 2. Upload to the correct brand folder! (e.g. products/pidilite/image.jpg)
    const uploadPath = `${brandSlug}/${file}`;
    
    const { error: uploadError } = await supabase.storage
      .from(useBucket)
      .upload(uploadPath, fileBuffer, {
        contentType: mimeType,
        upsert: true
      });
      
    if (uploadError) {
      console.error(`❌ Error uploading ${file}:`, uploadError.message);
      continue;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(useBucket)
      .getPublicUrl(uploadPath);
      
    // 3. Update the database with the exact organized URL
    const { error: updateError } = await supabase
      .from('products')
      .update({ images: [publicUrl] })
      .eq('id', product.id);
        
    if (updateError) {
        console.error(`❌ Error updating DB for ${name}:`, updateError.message);
    } else {
        console.log(`✅ Uploaded & Linked: "${product.name}" -> Organized into folder [${brandSlug}]`);
        updatedCount++;
    }
  }
  
  console.log(`\n🎉 All done! Successfully uploaded and organized ${updatedCount} products.\n`);
}

main().catch(console.error);
