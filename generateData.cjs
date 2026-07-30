const fs = require('fs');

const products = [
  // pidilite mapping
  // We need the product ID from db.js for these to map correctly in SQL
  {
    name: 'FEVICOL SH',
    id: 'a1000000-0000-0000-0000-000000000001',
    brand: 'PID',
    type: 'FSH',
    variants: [
      { size: '60 KG', basic: 11287.80, dlp: 13319.60, mrp: 16695 },
      { size: '50 KG', basic: 9756, dlp: 11512.08, mrp: 14780 },
      { size: '30 KG', basic: 5998.20, dlp: 7077.88, mrp: 9090 },
      { size: '20 KG', basic: 4131, dlp: 4874.58, mrp: 6240 },
      { size: '10 KG', basic: 2173.60, dlp: 2564.85, mrp: 3280 },
      { size: '5 KG', basic: 1132.30, dlp: 1336.11, mrp: 1705 },
      { size: '2 KG', basic: 471.26, dlp: 556.09, mrp: 725 },
      { size: '1 KG', basic: 246.69, dlp: 291.09, mrp: 395 },
      { size: '500 GM', basic: 132.61, dlp: 156.48, mrp: 215 },
      { size: '250 GM', basic: 74.09, dlp: 87.43, mrp: 120 },
      { size: '125 GM', basic: 39.53, dlp: 46.65, mrp: 70 },
      { size: '50 GM', basic: 20.74, dlp: 24.47, mrp: 40 }
    ]
  },
  {
    name: 'FEVICOL MARINE',
    id: 'a1000000-0000-0000-0000-000000000003',
    brand: 'PID',
    type: 'MAR',
    variants: [
      { size: '60 KG', basic: 14883.60, dlp: 17562.65, mrp: 21550 },
      { size: '50 KG', basic: 12553.50, dlp: 14813.13, mrp: 18265 },
      { size: '30 KG', basic: 7697.40, dlp: 9082.93, mrp: 11190 },
      { size: '20 KG', basic: 5222.40, dlp: 6162.43, mrp: 7615 },
      { size: '10 KG', basic: 2716.30, dlp: 3205.23, mrp: 3950 },
      { size: '5 KG', basic: 1404.00, dlp: 1656.66, mrp: 2060 },
      { size: '2 KG', basic: 588.02, dlp: 693.86, mrp: 865 },
      { size: '1 KG', basic: 306.08, dlp: 361.17, mrp: 465 },
      { size: '500 GM', basic: 163.63, dlp: 193.08, mrp: 255 }
    ]
  },
  {
    name: 'FEVICOL HI-PER',
    id: 'a1000000-0000-0000-0000-000000000004',
    brand: 'PID',
    type: 'HIP',
    variants: [
      { size: '60 KG', basic: 17454, dlp: 20595.72, mrp: 25350 },
      { size: '50 KG', basic: 14545, dlp: 17163.10, mrp: 21130 },
      { size: '30 KG', basic: 8817, dlp: 10404.06, mrp: 12810 },
      { size: '20 KG', basic: 5988, dlp: 7065.84, mrp: 8690 },
      { size: '10 KG', basic: 3094, dlp: 3650.92, mrp: 4495 },
      { size: '5 KG', basic: 1609.5, dlp: 1899.21, mrp: 2365 },
      { size: '2 KG', basic: 688.80, dlp: 789.18, mrp: 1010 },
      { size: '1 KG', basic: 347.9, dlp: 410.52, mrp: 525 },
      { size: '500 GM', basic: 188.2, dlp: 222.08, mrp: 295 }
    ]
  },
  {
    name: 'FEVICOL HI-PER STAR',
    id: 'a1000000-0000-0000-0000-000000000006',
    brand: 'PID',
    type: 'HPS',
    variants: [
      { size: '50 KG', basic: 16105, dlp: 19003.90, mrp: 23390 },
      { size: '20 KG', basic: 6632, dlp: 7825.76, mrp: 9630 },
      { size: '10 KG', basic: 3426, dlp: 4042.68, mrp: 4980 },
      { size: '5 KG', basic: 1783, dlp: 2103.94, mrp: 2605 },
      { size: '2 KG', basic: 740.2, dlp: 873.44, mrp: 1105 },
      { size: '1 KG', basic: 385.10, dlp: 454.42, mrp: 580 }
    ]
  },
  {
    name: 'FEVICOL PROBOND',
    id: 'a1000000-0000-0000-0000-000000000005', // Acrlyic/PVC adhesive
    brand: 'PID',
    type: 'PRO',
    variants: [
      { size: '20 KG', basic: 6650.00, dlp: 7847.00, mrp: 9625 },
      { size: '10 KG', basic: 3351.00, dlp: 3954.18, mrp: 4890 },
      { size: '5 KG', basic: 1745.00, dlp: 2059.10, mrp: 2600 },
      { size: '1 KG', basic: 362.00, dlp: 427.16, mrp: 565 },
      { size: '500 GM', basic: 201.00, dlp: 237.18, mrp: 320 }
    ]
  },
  {
    name: 'FEVICOL HEATX',
    id: 'a1000000-0000-0000-0000-000000000007',
    brand: 'PID',
    type: 'HTX',
    variants: [
      { size: '5 LT', basic: 2130.00, dlp: 2513.99, mrp: 3095 },
      { size: '2 LT', basic: 880.20, dlp: 1038.64, mrp: 1305 },
      { size: '1 LT', basic: 453.60, dlp: 535.25, mrp: 680 },
      { size: '500 ML', basic: 233.30, dlp: 275.29, mrp: 365 },
      { size: '200 ML', basic: 108.82, dlp: 128.41, mrp: 185 },
      { size: '100 ML', basic: 59.76, dlp: 70.52, mrp: 105 }
    ]
  },
  {
    name: 'FEVICOL SR 998',
    id: 'a1000000-0000-0000-0000-000000000008',
    brand: 'PID',
    type: 'SR9',
    variants: [
      { size: '25 LT', basic: 8667.50, dlp: 10227.65, mrp: 12270 },
      { size: '5 LT', basic: 1799.10, dlp: 2122.94, mrp: 2560 },
      { size: '2 LT', basic: 749.44, dlp: 884.34, mrp: 1070 },
      { size: '1 LT', basic: 384.10, dlp: 453.24, mrp: 585 },
      { size: '500 ML', basic: 206.93, dlp: 244.18, mrp: 315 },
      { size: '200 ML', basic: 95.00, dlp: 112.07, mrp: 165 },
      { size: '100 ML', basic: 53.31, dlp: 62.93, mrp: 100 }
    ]
  },
  {
    name: 'MASTERLOK',
    id: 'a1000000-0000-0000-0000-000000000020',
    brand: 'PID',
    type: 'MLK',
    variants: [
      { size: '50 KG', basic: 5200, dlp: 6136.00, mrp: 9910 },
      { size: '20 KG', basic: 2410, dlp: 2843.00, mrp: 4050 },
      { size: '10 KG', basic: 1090, dlp: 1286.20, mrp: 2090 },
      { size: '5 KG', basic: 555, dlp: 654.90, mrp: 1070 },
      { size: '2 KG', basic: 226, dlp: 266.68, mrp: 500 },
      { size: '1 KGPP', basic: 105, dlp: 123.90, mrp: 230 },
      { size: '1 KG', basic: 115, dlp: 135.70, mrp: 245 },
      { size: '500 GM', basic: 62, dlp: 73.16, mrp: 130 },
      { size: '250 GM', basic: 34.50, dlp: 40.71, mrp: 80 },
      { size: '125 GM', basic: 18.50, dlp: 21.83, mrp: 60 }
    ]
  },
  {
    name: 'BULBOND',
    id: 'a1000000-0000-0000-0000-000000000022',
    brand: 'PID',
    type: 'BBD',
    variants: [
      { size: '50 KG', basic: 5807, dlp: 6852.26, mrp: 10945 },
      { size: '20 KG', basic: 2381.6, dlp: 2810.29, mrp: 4455 },
      { size: '5 KG', basic: 609.6, dlp: 719.33, mrp: 1150 },
      { size: '1 KGPP', basic: 116.51, dlp: 137.48, mrp: 255 },
      { size: '1 KG', basic: 134.59, dlp: 158.82, mrp: 270 },
      { size: '500 PP', basic: 65, dlp: 76.53, mrp: 140 },
      { size: '500 GM', basic: 78.16, dlp: 92.41, mrp: 160 }
    ]
  },
  {
    name: 'GRIPPO',
    id: 'a1000000-0000-0000-0000-000000000023',
    brand: 'PID',
    type: 'GRP',
    variants: [
      { size: '50 KG', basic: 4250, dlp: 5015.00, mrp: 7690 },
      { size: '20 KG', basic: 1864.6, dlp: 2200.23, mrp: 3295 },
      { size: '10 KG', basic: 933, dlp: 1100.11, mrp: 1690 },
      { size: '5 KG', basic: 475, dlp: 560.50, mrp: 870 },
      { size: '1 KGPP', basic: 88, dlp: 103.84, mrp: 170 },
      { size: '1 KG', basic: 97, dlp: 114.46, mrp: 180 }
    ]
  }
];

let sql = '';
let js = '';
let allProductIds = products.map(p => `'${p.id}'`).join(', ');

sql += `-- 1. Delete old variants for these products to ensure clean slate\n`;
sql += `DELETE FROM "public"."product_variants" WHERE product_id IN (${allProductIds});\n\n`;

sql += `-- 2. Insert new variants\n`;
sql += `INSERT INTO "public"."product_variants" ("id", "product_id", "pack_size", "sku", "price", "mrp", "dealer_price", "stock", "moq", "weight", "created_at") VALUES \n`;

let values = [];

function generateUUID() {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function parseWeight(sizeStr) {
  let w = 1;
  let lower = sizeStr.toLowerCase();
  let num = parseFloat(sizeStr);
  if (lower.includes('kg') || lower.includes('lt')) {
    w = num;
  } else if (lower.includes('gm') || lower.includes('ml')) {
    w = num / 1000;
  }
  return w;
}

products.forEach((p, pIndex) => {
  js += `\n    // ${p.name}\n`;
  p.variants.forEach((v, vIndex) => {
    let sku = `CKP-${p.brand}-${p.type}-${v.size.replace(/[^A-Z0-9]/ig, '').toUpperCase()}`;
    let uuid = generateUUID();
    let weight = parseWeight(v.size);
    let moq = (v.size.includes('KG') && parseFloat(v.size) >= 20) ? 1 : 5;
    
    // SQL values
    values.push(`('${uuid}', '${p.id}', '${v.size}', '${sku}', ${v.basic.toFixed(2)}, ${v.mrp.toFixed(2)}, ${v.dlp.toFixed(2)}, 100, ${moq}, ${weight.toFixed(2)}, NOW())`);
    
    // JS object string for db.js
    let vid = `v${pIndex}_${vIndex}`;
    js += `      { id: '${vid}', pack_size: '${v.size}', sku: '${sku}', price: ${v.basic.toFixed(2)}, mrp: ${v.mrp.toFixed(2)}, dealer_price: ${v.dlp.toFixed(2)}, stock: 100, moq: ${moq}, weight: ${weight.toFixed(2)} },\n`;
  });
});

sql += values.join(',\n') + ';\n';

fs.writeFileSync('generated_price_update.sql', sql);
fs.writeFileSync('db_variants_chunk.txt', js);

console.log("Files generated successfully!");
