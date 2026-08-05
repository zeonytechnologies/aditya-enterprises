const fs = require('fs');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

const rawMapei = fs.readFileSync('scratch/mapei_products.txt', 'utf8');

// Mapei Brand ID - generating a constant one for this script
const brand_id = 'b9999999-9999-9999-9999-999999999999';

const rawLines = rawMapei.trim().split(/\r?\n/);
console.log("Raw lines length:", rawLines.length);
let currentBlock = [];
const blocks = [];

for (let i = 0; i < rawLines.length; i++) {
  const line = rawLines[i].trim();
  if (line === '') {
    if (currentBlock.length >= 2) {
      blocks.push(currentBlock);
    }
    currentBlock = [];
  } else {
    currentBlock.push(line);
  }
}
if (currentBlock.length >= 2) {
  blocks.push(currentBlock);
}

const products = [];

blocks.forEach(lines => {
  if (lines.length >= 2) {
    const name = lines[0].trim();
    const packStr = lines[1].replace(/Pack(aging| size)\\s*:/i, '').trim();
    
    // Split pack sizes by comma or slash
    const packs = packStr.split(/[,/]/).map(p => p.trim()).filter(p => p);

    
    products.push({
      product_id: uuidv4(),
      name: name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Math.floor(Math.random()*10000),
      sku: 'CKP-' + name.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Math.floor(Math.random()*10000),
      description: name + ' (MAPEI)',
      hsn_code: '3824', // Adhesives/Cements HSN
      brand_id,
      variants: packs.map(pack => ({
        variant_id: uuidv4(),
        pack_size: pack,
        sku: 'CKP-' + name.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + pack.toUpperCase().replace(/[^A-Z0-9]/g, '') + '-' + Math.floor(Math.random()*1000),
        price: Math.floor(Math.random() * 500) + 500, // Dummy basic cost 500-1000
        mrp: 0,
        dealer_price: 0
      }))
    });
  }
});

// Calculate derived prices for variants
products.forEach(p => {
  p.variants.forEach(v => {
    v.dealer_price = v.price * 1.18; // plus GST 18%
    v.mrp = Math.floor(v.price * 1.5); // 50% margin
  });
});

let sql = '-- INSERT MAPEI BRAND\n';
sql += `INSERT INTO public.brands (id, name, slug, logo_url, description, catalog_url) VALUES\n`;
sql += `('${brand_id}', 'Mapei', 'mapei', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80', 'MAPEI is a global leader in the production of adhesives, sealants and chemical products for the building industry.', '#')\n`;
sql += `ON CONFLICT (id) DO NOTHING;\n\n`;

sql += '-- MAPEI PRODUCTS AND VARIANTS SEEDING\n\n';

let productsSql = 'INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, stock, sku, hsn_code, gst_percent, brand_id) VALUES\n';
let variantsSql = 'INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock) VALUES\n';

const pVals = [];
const vVals = [];

products.forEach(p => {
  if (p.variants.length === 0) {
    // If no variants extracted, just create one default variant
    const defPrice = 600;
    p.variants.push({
      variant_id: uuidv4(),
      pack_size: 'Standard',
      sku: p.sku + '-STD',
      price: defPrice,
      mrp: Math.floor(defPrice * 1.5),
      dealer_price: defPrice * 1.18
    });
  }

  const basePrice = p.variants[0].price;
  const baseMrp = p.variants[0].mrp;
  const baseDealerPrice = p.variants[0].dealer_price;
  const gstPercent = 18;
  
  pVals.push(`('${p.product_id}', '${p.name.replace(/'/g, "''")}', '${p.slug}', '${p.description.replace(/'/g, "''")}', ${basePrice}, ${baseMrp}, ${baseDealerPrice}, 100, '${p.sku}', '${p.hsn_code}', ${gstPercent}, '${p.brand_id}')`);
  
  p.variants.forEach(v => {
    vVals.push(`('${v.variant_id}', '${p.product_id}', '${v.pack_size.replace(/'/g, "''")}', '${v.sku}', ${v.price}, ${v.mrp}, ${v.dealer_price}, 100)`);
  });
});

sql += productsSql + pVals.join(',\n') + ';\n\n';
sql += variantsSql + vVals.join(',\n') + ';\n';

fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/b4668c9f-940e-4ddb-9c0b-15c9a8961658/scratch/mapei_seed.sql', sql);
console.log('Generated SQL with ' + products.length + ' Mapei products and ' + vVals.length + ' variants.');
