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
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const priceMap = JSON.parse(fs.readFileSync('price_map_2.json', 'utf8'));

async function generateSQL() {
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  const { data: variants, error: varErr } = await supabase.from('product_variants').select('*');
  
  if (prodErr || varErr) {
    console.error(prodErr, varErr);
    process.exit(1);
  }

  let sql = '-- Auto-generated price updates from PDF\n\n';

  const normalize = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const mapKeys = Object.keys(priceMap);

  for (const variant of variants) {
    const parentProduct = products.find(p => p.id === variant.product_id);
    if (!parentProduct) continue;
    
    const matchName = mapKeys.find(k => {
      return normalize(parentProduct.name).includes(normalize(k)) || normalize(k).includes(normalize(parentProduct.name));
    });

    if (matchName) {
      const packSizes = priceMap[matchName];
      let matchPack = Object.keys(packSizes).find(k => normalize(variant.pack_size) === normalize(k));
      if (!matchPack) {
        matchPack = Object.keys(packSizes).find(k => normalize(variant.sku).includes(normalize(k)));
      }
      if (!matchPack && variant.pack_size) {
        matchPack = Object.keys(packSizes).find(k => normalize(k).includes(normalize(variant.pack_size.split(' ')[0])));
      }

      if (matchPack) {
        const prices = packSizes[matchPack];
        sql += `UPDATE public.product_variants SET price = ${prices.basic}, dealer_price = ${prices.dlp}, mrp = ${prices.mrp} WHERE id = '${variant.id}';\n`;
      }
    }
  }

  for (const product of products) {
    const matchName = mapKeys.find(k => {
      return normalize(product.name).includes(normalize(k)) || normalize(k).includes(normalize(product.name));
    });

    if (matchName) {
      const packSizes = priceMap[matchName];
      let matchPack = Object.keys(packSizes).find(k => normalize(product.pack_size) === normalize(k));
      if (!matchPack && product.sku) {
        matchPack = Object.keys(packSizes).find(k => normalize(product.sku).includes(normalize(k)));
      }
      if (!matchPack && product.pack_size) {
        matchPack = Object.keys(packSizes).find(k => normalize(k).includes(normalize(product.pack_size.split(' ')[0])));
      }
      if (!matchPack) {
          matchPack = Object.keys(packSizes)[0];
      }
      if (matchPack) {
        const prices = packSizes[matchPack];
        sql += `UPDATE public.products SET price = ${prices.basic}, dealer_price = ${prices.dlp}, mrp = ${prices.mrp} WHERE id = '${product.id}';\n`;
      }
    }
  }

  fs.writeFileSync('update_prices_pdf.sql', sql);
  console.log(`Generated update_prices_pdf.sql with ${sql.split('\n').length - 2} statements.`);
}

generateSQL();
