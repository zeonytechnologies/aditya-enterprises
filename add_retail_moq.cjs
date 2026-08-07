const fs = require('fs');

// --- 1. AdminDashboard.jsx ---
let adminContent = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

// State initializations
adminContent = adminContent.replace(
  /name: '', price: 0, mrp: 0, dealer_price: 0, moq: 1, stock: 10,/g,
  "name: '', price: 0, mrp: 0, dealer_price: 0, moq: 1, retail_moq: 1, stock: 10,"
);
adminContent = adminContent.replace(
  /moq: prod.moq \|\| 1, stock: prod.stock, sku: prod.sku, hsn_code: prod.hsn_code,/g,
  "moq: prod.moq || 1, retail_moq: prod.retail_moq || 1, stock: prod.stock, sku: prod.sku, hsn_code: prod.hsn_code,"
);

// handleSaveProduct variables
adminContent = adminContent.replace(
  /let moq = parseInt\(productForm.moq\);/g,
  "let moq = parseInt(productForm.moq);\n        let retail_moq = parseInt(productForm.retail_moq || 1);"
);

// Variant checking in handleSaveProduct
adminContent = adminContent.replace(
  /moq = firstVar.moq !== undefined && firstVar.moq !== '' \? parseInt\(firstVar.moq\) : moq;/g,
  "moq = firstVar.moq !== undefined && firstVar.moq !== '' ? parseInt(firstVar.moq) : moq;\n          retail_moq = firstVar.retail_moq !== undefined && firstVar.retail_moq !== '' ? parseInt(firstVar.retail_moq) : retail_moq;"
);

// Data structure in handleSaveProduct
adminContent = adminContent.replace(
  /moq,\s*stock,\s*sku,/g,
  "moq,\n          retail_moq,\n          stock,\n          sku,"
);
adminContent = adminContent.replace(
  /moq: product.moq,\s*stock: product.stock,/g,
  "moq: product.moq,\n          retail_moq: product.retail_moq,\n          stock: product.stock,"
);

// Base product UI: add retail_moq next to B2B MOQ
const b2bMoqInput = `<div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">B2B MOQ *</label>
                    <input
                      type="number"
                      required
                      value={productForm.moq}
                      onChange={(e) => setProductForm(prev => ({ ...prev, moq: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                    />
                  </div>`;
const retailMoqInput = `<div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Retail MOQ *</label>
                    <input
                      type="number"
                      required
                      value={productForm.retail_moq || 1}
                      onChange={(e) => setProductForm(prev => ({ ...prev, retail_moq: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                    />
                  </div>`;

if (adminContent.includes(b2bMoqInput)) {
    adminContent = adminContent.replace(b2bMoqInput, b2bMoqInput + '\n                  ' + retailMoqInput);
} else {
    // try removing strict whitespaces
    const regexB2b = /<div className="space-y-1">\s*<label className="font-bold text-slate-400 uppercase tracking-wider block">B2B MOQ \*<\/label>\s*<input\s*type="number"\s*required\s*value=\{productForm\.moq\}\s*onChange=\{\(e\) => setProductForm\(prev => \(\{ \.\.\.prev, moq: e\.target\.value \}\)\)\}\s*className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"\s*\/>\s*<\/div>/g;
    adminContent = adminContent.replace(regexB2b, match => match + '\n                  ' + retailMoqInput);
}

// Ensure the grid wrapping base form has enough columns
adminContent = adminContent.replace(/<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">/g, '<div className="grid grid-cols-1 sm:grid-cols-5 gap-4">');

// Variants UI: add retail_moq input
adminContent = adminContent.replace(
  /moq: 1,\s*weight: 1\s*\}\]\)/g,
  "moq: 1,\n                        retail_moq: 1,\n                        weight: 1\n                      }])"
);

const variantMoqInput = /<div>\s*<label className="block text-\[9px\] font-bold text-slate-400 uppercase">MOQ \(Units\)\s*\*\s*<\/label>\s*<input\s*type="number"\s*required\s*value=\{variant\.moq\}\s*onChange=\{\(e\) => \{\s*const updated = \[\.\.\.variantItems\];\s*updated\[idx\]\.moq = parseInt\(e\.target\.value\) \|\| 0;\s*setVariantItems\(updated\);\s*\}\}\s*className="w-full px-2 py-1\.5 border rounded-lg bg-white dark:bg-slate-900"\s*\/>\s*<\/div>/g;

const variantRetailMoqInput = `<div>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase">Retail MOQ (Units) *</label>
                              <input
                                type="number"
                                required
                                value={variant.retail_moq || 1}
                                onChange={(e) => {
                                  const updated = [...variantItems];
                                  updated[idx].retail_moq = parseInt(e.target.value) || 0;
                                  setVariantItems(updated);
                                }}
                                className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-900"
                              />
                            </div>`;

adminContent = adminContent.replace(variantMoqInput, match => match + '\n                            ' + variantRetailMoqInput);

fs.writeFileSync('src/pages/AdminDashboard.jsx', adminContent);

// --- 2. CartContext.jsx ---
let cartContent = fs.readFileSync('src/context/CartContext.jsx', 'utf8');

cartContent = cartContent.replace(
  /const minQty = \(user && \(user\.role === 'dealer' \|\| user\.role === 'distributor'\)\) \? \(target\.moq \|\| 1\) : 1;/g,
  "const minQty = (user && (user.role === 'dealer' || user.role === 'distributor')) ? (target.moq || 1) : (target.retail_moq || 1);"
);

fs.writeFileSync('src/context/CartContext.jsx', cartContent);

// --- 3. ProductDetails.jsx ---
let detailContent = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

detailContent = detailContent.replace(
  /setQuantity\(isB2B \? \(sorted\[0\]\.moq \|\| 1\) : 1\);/g,
  "setQuantity(isB2B ? (sorted[0].moq || 1) : (sorted[0].retail_moq || 1));"
);
detailContent = detailContent.replace(
  /setQuantity\(isB2B \? \(data\.moq \|\| 1\) : 1\);/g,
  "setQuantity(isB2B ? (data.moq || 1) : (data.retail_moq || 1));"
);
detailContent = detailContent.replace(
  /const minQty = isB2B \? \(\(selectedVariant \|\| product\)\.moq \|\| 1\) : 1;/g,
  "const minQty = isB2B ? ((selectedVariant || product).moq || 1) : ((selectedVariant || product).retail_moq || 1);"
);
detailContent = detailContent.replace(
  /setQuantity\(isB2B \? \(v\.moq \|\| 1\) : 1\);/g,
  "setQuantity(isB2B ? (v.moq || 1) : (v.retail_moq || 1));"
);

fs.writeFileSync('src/pages/ProductDetails.jsx', detailContent);

console.log('Script executed');
