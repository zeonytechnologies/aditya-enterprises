const fs = require('fs');
let code = fs.readFileSync('src/services/db.js', 'utf8');
code = code.replace(/sku:\s*'([^']+)'/g, (match, sku) => {
  if (sku.startsWith('CKP-')) return match;
  return `sku: 'CKP-${sku}'`;
});
fs.writeFileSync('src/services/db.js', code);
console.log('Successfully updated SKUs in db.js');
