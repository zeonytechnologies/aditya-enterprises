const fs = require('fs');

let dbCode = fs.readFileSync('src/services/db.js', 'utf8');

const newVariantsMap = {
  'p1': [
      { id: 'v0_0', pack_size: '60 KG', sku: 'CKP-PID-FSH-60KG', price: 11287.80, mrp: 16695.00, dealer_price: 13319.60, stock: 100, moq: 1, weight: 60.00 },
      { id: 'v0_1', pack_size: '50 KG', sku: 'CKP-PID-FSH-50KG', price: 9756.00, mrp: 14780.00, dealer_price: 11512.08, stock: 100, moq: 1, weight: 50.00 },
      { id: 'v0_2', pack_size: '30 KG', sku: 'CKP-PID-FSH-30KG', price: 5998.20, mrp: 9090.00, dealer_price: 7077.88, stock: 100, moq: 1, weight: 30.00 },
      { id: 'v0_3', pack_size: '20 KG', sku: 'CKP-PID-FSH-20KG', price: 4131.00, mrp: 6240.00, dealer_price: 4874.58, stock: 100, moq: 1, weight: 20.00 },
      { id: 'v0_4', pack_size: '10 KG', sku: 'CKP-PID-FSH-10KG', price: 2173.60, mrp: 3280.00, dealer_price: 2564.85, stock: 100, moq: 5, weight: 10.00 },
      { id: 'v0_5', pack_size: '5 KG', sku: 'CKP-PID-FSH-5KG', price: 1132.30, mrp: 1705.00, dealer_price: 1336.11, stock: 100, moq: 5, weight: 5.00 },
      { id: 'v0_6', pack_size: '2 KG', sku: 'CKP-PID-FSH-2KG', price: 471.26, mrp: 725.00, dealer_price: 556.09, stock: 100, moq: 5, weight: 2.00 },
      { id: 'v0_7', pack_size: '1 KG', sku: 'CKP-PID-FSH-1KG', price: 246.69, mrp: 395.00, dealer_price: 291.09, stock: 100, moq: 5, weight: 1.00 },
      { id: 'v0_8', pack_size: '500 GM', sku: 'CKP-PID-FSH-500GM', price: 132.61, mrp: 215.00, dealer_price: 156.48, stock: 100, moq: 5, weight: 0.50 },
      { id: 'v0_9', pack_size: '250 GM', sku: 'CKP-PID-FSH-250GM', price: 74.09, mrp: 120.00, dealer_price: 87.43, stock: 100, moq: 5, weight: 0.25 },
      { id: 'v0_10', pack_size: '125 GM', sku: 'CKP-PID-FSH-125GM', price: 39.53, mrp: 70.00, dealer_price: 46.65, stock: 100, moq: 5, weight: 0.13 },
      { id: 'v0_11', pack_size: '50 GM', sku: 'CKP-PID-FSH-50GM', price: 20.74, mrp: 40.00, dealer_price: 24.47, stock: 100, moq: 5, weight: 0.05 }
  ],
  'p8': [
      { id: 'v1_0', pack_size: '60 KG', sku: 'CKP-PID-MAR-60KG', price: 14883.60, mrp: 21550.00, dealer_price: 17562.65, stock: 100, moq: 1, weight: 60.00 },
      { id: 'v1_1', pack_size: '50 KG', sku: 'CKP-PID-MAR-50KG', price: 12553.50, mrp: 18265.00, dealer_price: 14813.13, stock: 100, moq: 1, weight: 50.00 },
      { id: 'v1_2', pack_size: '30 KG', sku: 'CKP-PID-MAR-30KG', price: 7697.40, mrp: 11190.00, dealer_price: 9082.93, stock: 100, moq: 1, weight: 30.00 },
      { id: 'v1_3', pack_size: '20 KG', sku: 'CKP-PID-MAR-20KG', price: 5222.40, mrp: 7615.00, dealer_price: 6162.43, stock: 100, moq: 1, weight: 20.00 },
      { id: 'v1_4', pack_size: '10 KG', sku: 'CKP-PID-MAR-10KG', price: 2716.30, mrp: 3950.00, dealer_price: 3205.23, stock: 100, moq: 5, weight: 10.00 },
      { id: 'v1_5', pack_size: '5 KG', sku: 'CKP-PID-MAR-5KG', price: 1404.00, mrp: 2060.00, dealer_price: 1656.66, stock: 100, moq: 5, weight: 5.00 },
      { id: 'v1_6', pack_size: '2 KG', sku: 'CKP-PID-MAR-2KG', price: 588.02, mrp: 865.00, dealer_price: 693.86, stock: 100, moq: 5, weight: 2.00 },
      { id: 'v1_7', pack_size: '1 KG', sku: 'CKP-PID-MAR-1KG', price: 306.08, mrp: 465.00, dealer_price: 361.17, stock: 100, moq: 5, weight: 1.00 },
      { id: 'v1_8', pack_size: '500 GM', sku: 'CKP-PID-MAR-500GM', price: 163.63, mrp: 255.00, dealer_price: 193.08, stock: 100, moq: 5, weight: 0.50 }
  ]
};

for (const [id, variants] of Object.entries(newVariantsMap)) {
  const productIndex = dbCode.indexOf(`id: '${id}'`);
  if (productIndex === -1) continue;

  const variantsIndex = dbCode.indexOf('variants: [', productIndex);
  if (variantsIndex === -1) continue;
  
  const closingIndex = dbCode.indexOf('    ]', variantsIndex);
  
  if (closingIndex !== -1) {
    const variantsStr = JSON.stringify(variants, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, "'");
    
    // Replace `variants: [ ... ]` with `variants: <variantsStr>`
    dbCode = dbCode.substring(0, variantsIndex) + 'variants: ' + variantsStr.split('\n').join('\n      ') + '\n' + dbCode.substring(closingIndex + 5);
  }
}

// Fix indentation
dbCode = dbCode.replace(/      \]/g, '    ]');

fs.writeFileSync('src/services/db.js', dbCode);
console.log('db.js updated successfully!');
