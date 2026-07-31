const fs = require('fs');

const data = [
  {
    name: "Terminator Structure Preservative",
    category: "Wood Preservative",
    variants: [
      { size: "5 LTR", basic: 1533.55, dlp: 1809.59, mrp: 2295 },
      { size: "1 LTR", basic: 325.58, dlp: 384.18, mrp: 490 },
      { size: "500 ML", basic: 174.62, dlp: 206.05, mrp: 265 }
    ]
  },
  {
    name: "Terminator Wood Preservative",
    category: "Wood Preservative",
    variants: [
      { size: "1 LTR", basic: 282.79, dlp: 333.69, mrp: 435 },
      { size: "5 LTR", basic: 1357.15, dlp: 1601.44, mrp: 2030 },
      { size: "100 ML", basic: 41.44, dlp: 48.90, mrp: 70 },
      { size: "250 ML", basic: 81.54, dlp: 96.22, mrp: 130 },
      { size: "3 LTR", basic: 746.76, dlp: 994.46, mrp: 1270 },
      { size: "500 ML", basic: 154.12, dlp: 181.86, mrp: 235 }
    ]
  },
  {
    name: "Terminator Wood Preservative Spray",
    category: "Wood Preservative",
    variants: [
      { size: "1 LTR", basic: 335.30, dlp: 395.65, mrp: 530 },
      { size: "500 ML", basic: 200.40, dlp: 236.47, mrp: 320 },
      { size: "320 ML", basic: 157.00, dlp: 185.26, mrp: 250 }
    ]
  },
  {
    name: "Feviseal GP",
    category: "Sealant",
    variants: [
      { size: "W-B-C", basic: 102, dlp: 120.00, mrp: 315 }
    ]
  },
  {
    name: "Feviseal GP-PRO",
    category: "Sealant",
    variants: [
      { size: "W-B-C", basic: 117, dlp: 138.00, mrp: 325 }
    ]
  },
  {
    name: "Feviseal Neutral PRO",
    category: "Sealant",
    variants: [
      { size: "W-B-C", basic: 132, dlp: 156, mrp: 400 },
      { size: "GREY", basic: 134, dlp: 158.0, mrp: 400 },
      { size: "BROWN", basic: 144, dlp: 170.0, mrp: 400 }
    ]
  },
  {
    name: "Feviseal Weather Proof",
    category: "Sealant",
    variants: [
      { size: "W-B-C", basic: 179, dlp: 211.00, mrp: 425 },
      { size: "GREY", basic: 189, dlp: 223.0, mrp: 450 },
      { size: "BROWN", basic: 204, dlp: 241, mrp: 450 }
    ]
  },
  {
    name: "Feviseal Multi Purpose",
    category: "Sealant",
    variants: [
      { size: "W-B-C", basic: 80.00, dlp: 95, mrp: 250 }
    ]
  },
  {
    name: "Feviseal B&K",
    category: "Sealant",
    variants: [
      { size: "WHITE", basic: 85, dlp: 100.30, mrp: 140 }
    ]
  },
  {
    name: "Fevicol Wudfill",
    category: "Wood Care",
    variants: [
      { size: "50 GM", basic: 84.80, dlp: 101.52, mrp: 160 },
      { size: "20 GM", basic: 42.40, dlp: 51, mrp: 80 }
    ]
  },
  {
    name: "Fevikwik 463",
    category: "Adhesive",
    variants: [
      { size: "250 GM", basic: 332.80, dlp: 392.70, mrp: 800 },
      { size: "125 GM", basic: 172.88, dlp: 206, mrp: 420 },
      { size: "20 GM", basic: 43.91, dlp: 52.41, mrp: 85 }
    ]
  },
  {
    name: "Fevikwik 203",
    category: "Adhesive",
    variants: [
      { size: "50 GM", basic: 88.87, dlp: 106.00, mrp: 170 },
      { size: "20 GM", basic: 43.91, dlp: 53.00, mrp: 85 }
    ]
  },
  {
    name: "Fevicol SR 505",
    category: "Adhesive",
    variants: [
      { size: "25 LT", basic: 7018.75, dlp: 8282, mrp: 10835 },
      { size: "5 LT", basic: 1682, dlp: 1681.5, mrp: 2215 },
      { size: "2 LT", basic: 707, dlp: 706.82, mrp: 945 },
      { size: "1 LT", basic: 355, dlp: 355.48, mrp: 490 },
      { size: "500 ML", basic: 190.00, dlp: 189.98, mrp: 265 }
    ]
  },
  {
    name: "Ezeespray",
    category: "Adhesive",
    variants: [
      { size: "500 ML", basic: 440.6, dlp: 520, mrp: 870 }
    ]
  },
  {
    name: "Edgeglok",
    category: "Adhesive",
    variants: [
      { size: "140 GM", basic: 75, dlp: 88, mrp: 125 }
    ]
  },
  {
    name: "1K PUR",
    category: "Adhesive",
    variants: [
      { size: "500 GM", basic: 336, dlp: 397, mrp: 595 }
    ]
  },
  {
    name: "PU Foam",
    category: "Sealant",
    variants: [
      { size: "720 GM", basic: 290, dlp: 342.2, mrp: 1000 }
    ]
  },
  {
    name: "Powerlok",
    category: "Adhesive",
    variants: [
      { size: "430 GM", basic: 125, dlp: 147, mrp: 330 }
    ]
  },
  {
    name: "Nail Free Ultra",
    category: "Adhesive",
    variants: [
      { size: "435 GM", basic: 280, dlp: 330.4, mrp: 549 }
    ]
  },
  {
    name: "Relam",
    category: "Adhesive",
    variants: [
      { size: "430 GM", basic: 295, dlp: 348, mrp: 470 }
    ]
  },
  {
    name: "Plaatilok",
    category: "Adhesive",
    variants: [
      { size: "430 GM", basic: 295, dlp: 348, mrp: 470 }
    ]
  },
  {
    name: "Xpress",
    category: "Adhesive",
    variants: [
      { size: "500 GM", basic: 476.46, dlp: 562.22, mrp: 850 }
    ]
  },
  {
    name: "Fevicol X-PER",
    category: "Adhesive",
    variants: [
      { size: "800 GM", basic: 444.8, dlp: 524.8, mrp: 670 }
    ]
  },
  {
    name: "Fevicol Multilock",
    category: "Adhesive",
    variants: [
      { size: "800 GM", basic: 521.6, dlp: 615.4, mrp: 785 }
    ]
  },
  {
    name: "Fevicol Fastrak",
    category: "Adhesive",
    variants: [
      { size: "25 LT", basic: 5050, dlp: 5959, mrp: 8655 }
    ]
  },
  {
    name: "Fevicol Bejod",
    category: "Adhesive",
    variants: [
      { size: "4.5 LT", basic: 1050.8, dlp: 1239, mrp: 2110 },
      { size: "25 LT", basic: 5744.00, dlp: 6777.00, mrp: 10695 }
    ]
  },
  {
    name: "Fevicol Floorfix VT",
    category: "Adhesive",
    variants: [
      { size: "5 KG", basic: 1186.25, dlp: 1399.78, mrp: 2195 },
      { size: "20 KG", basic: 4575, dlp: 5398.5, mrp: 8100 }
    ]
  },
  {
    name: "Fevicol Floorfix CP",
    category: "Adhesive",
    variants: [
      { size: "5 KG", basic: 1241.25, dlp: 1464.68, mrp: 2315 },
      { size: "10 KG", basic: 2407.5, dlp: 2840.85, mrp: 4570 },
      { size: "20 KG", basic: 4660, dlp: 5498.8, mrp: 8890 }
    ]
  },
  {
    name: "Woodlok Pro",
    category: "Adhesive",
    variants: [
      { size: "60 KG", basic: 7680, dlp: 9062.4, mrp: 10160 }
    ]
  },
  {
    name: "Fevicol 707 FW",
    category: "Adhesive",
    variants: [
      { size: "25 LT", basic: 6375, dlp: 7523, mrp: 10810 },
      { size: "5 LT", basic: 1290, dlp: 1522.00, mrp: 2395 },
      { size: "2 LT", basic: 533, dlp: 629.00, mrp: 950 },
      { size: "1 LT", basic: 271.00, dlp: 320, mrp: 505 },
      { size: "500 ML", basic: 140, dlp: 165.00, mrp: 265 }
    ]
  },
  {
    name: "Fevicol Foamfix",
    category: "Adhesive",
    variants: [
      { size: "25 LTR", basic: 6368.75, dlp: 7515.13, mrp: 10950 },
      { size: "5 LTR", basic: 1292.5, dlp: 1525.15, mrp: 2230 },
      { size: "2 LTR", basic: 535, dlp: 631.3, mrp: 925 },
      { size: "1 LTR", basic: 271.75, dlp: 320.67, mrp: 485 }
    ]
  }
];

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generateSKU(name, size) {
  let words = name.toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').split(' ').filter(w => w.length > 0);
  let shortName = words.map(w => w.substring(0, 3)).join('');
  let shortSize = size.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `CKP-${shortName}-${shortSize}`;
}

const crypto = require('crypto');

let sql = `BEGIN;\n\n`;

for (let p of data) {
  let pId = crypto.randomUUID();
  let pSlug = generateSlug(p.name);
  let pSKU = generateSKU(p.name, p.variants[0].size); // Base SKU for the product itself
  let basePrice = p.variants[0].basic;
  let baseMRP = p.variants[0].mrp;
  let baseDLP = p.variants[0].dlp;
  
  // Products insert (using ON CONFLICT to avoid errors)
  sql += `INSERT INTO public.products (id, name, slug, description, price, mrp, dealer_price, sku, hsn_code, stock)
VALUES ('${pId}', '${p.name}', '${pSlug}', '${p.name}', ${basePrice}, ${baseMRP}, ${baseDLP}, '${pSKU}', '35069190', 100)
ON CONFLICT (slug) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;\n\n`;

  for (let v of p.variants) {
    let vId = crypto.randomUUID();
    let vSKU = generateSKU(p.name, v.size);
    sql += `INSERT INTO public.product_variants (id, product_id, pack_size, sku, price, mrp, dealer_price, stock, moq)
VALUES (
  '${vId}', 
  (SELECT id FROM public.products WHERE slug = '${pSlug}'), 
  '${v.size}', 
  '${vSKU}', 
  ${v.basic}, 
  ${v.mrp}, 
  ${v.dlp}, 
  100, 
  1
)
ON CONFLICT (sku) DO UPDATE SET 
price = EXCLUDED.price, 
mrp = EXCLUDED.mrp, 
dealer_price = EXCLUDED.dealer_price;\n\n`;
  }
}

sql += `COMMIT;\n`;

fs.writeFileSync('insert_image_products.sql', sql);
console.log('Generated insert_image_products.sql');
