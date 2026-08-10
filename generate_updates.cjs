const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const envVars = envFile.split('\n').reduce((acc, line) => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) acc[match[1].trim()] = match[2].trim();
  return acc;
}, {});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const priceMap = JSON.parse(fs.readFileSync('price_map.json', 'utf8'));

async function generateSQL() {
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  const { data: variants, error: varErr } = await supabase.from('product_variants').select('*');
  
  if (prodErr || varErr) {
    console.error(prodErr, varErr);
    process.exit(1);
  }

  let sql = '-- Auto-generated price updates\n\n';

  // Update variants
  for (const variant of variants) {
    const parentProduct = products.find(p => p.id === variant.product_id);
    if (!parentProduct) continue;
    
    // Attempt to match parent product name
    const matchName = Object.keys(priceMap).find(k => parentProduct.name.toUpperCase().includes(k));
    if (matchName) {
      const packSizes = priceMap[matchName];
      let matchPack = Object.keys(packSizes).find(k => variant.pack_size.toUpperCase().replace(/\s+/g, '') === k.replace(/\s+/g, ''));
      if (!matchPack) {
        // Try SKU matching or partial pack_size match
        matchPack = Object.keys(packSizes).find(k => variant.sku.toUpperCase().includes(k.replace(/\s+/g, '')));
      }

      if (matchPack) {
        const prices = packSizes[matchPack];
        sql += `UPDATE public.product_variants SET price = ${prices.basic}, dealer_price = ${prices.dlp}, mrp = ${prices.mrp} WHERE id = '${variant.id}';\n`;
      }
    }
  }

  // Update base products (using the variant matching the base product's sku or pack_size)
  for (const product of products) {
    const matchName = Object.keys(priceMap).find(k => product.name.toUpperCase().includes(k));
    if (matchName) {
      const packSizes = priceMap[matchName];
      let matchPack = Object.keys(packSizes).find(k => (product.pack_size || '').toUpperCase().replace(/\s+/g, '') === k.replace(/\s+/g, ''));
      if (!matchPack && product.sku) {
        matchPack = Object.keys(packSizes).find(k => product.sku.toUpperCase().includes(k.replace(/\s+/g, '')));
      }
      
      if (matchPack) {
        const prices = packSizes[matchPack];
        sql += `UPDATE public.products SET price = ${prices.basic}, dealer_price = ${prices.dlp}, mrp = ${prices.mrp} WHERE id = '${product.id}';\n`;
      }
    }
  }

  fs.writeFileSync('update_prices.sql', sql);
  console.log(`Generated update_prices.sql with ${sql.split('\n').length - 2} statements.`);
}

generateSQL();
