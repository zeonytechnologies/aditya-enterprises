const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

// 1. Update z-index for Brand and Category modals
let parts = content.split('          {showBrandModal && (');
if (parts.length > 1) {
  parts[1] = parts[1].replace('z-50', 'z-[60]');
}
content = parts.join('          {showBrandModal && (');

let parts2 = content.split('          {showCategoryModal && (');
if (parts2.length > 1) {
  parts2[1] = parts2[1].replace('z-50', 'z-[60]');
}
content = parts2.join('          {showCategoryModal && (');

// 2. Replace the Brand and Category Association selects
const startMarker = '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">';
const endMarker = 'Description Details *</label>';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const replaceStr = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-400 uppercase tracking-wider block">Brand Association *</label>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingBrandId(null);
                          setBrandForm({ name: '', slug: '', description: '', logo_url: '' });
                          setShowBrandModal(true);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add New
                      </button>
                    </div>
                    <select
                      value={productForm.brand_id}
                      onChange={(e) => setProductForm(prev => ({ ...prev, brand_id: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-400 uppercase tracking-wider block">Category Association *</label>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingCategoryId(null);
                          setCategoryForm({ name: '', slug: '', description: '', icon: 'Layers', image_url: '' });
                          setShowCategoryModal(true);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add New
                      </button>
                    </div>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider block">Shelf Life</label>
                    <input
                      type="text"
                      placeholder="e.g. 12 Months"
                      value={productForm.shelf_life || ''}
                      onChange={(e) => setProductForm(prev => ({ ...prev, shelf_life: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block">`;

  content = content.substring(0, startIdx) + replaceStr + content.substring(endIdx + endMarker.length - 'Description Details *</label>'.length + 'Description Details *</label>'.length);
  fs.writeFileSync('src/pages/AdminDashboard.jsx', content);
  console.log("Successfully reapplied everything via indices!");
} else {
  console.log("Could not find start/end markers.");
}
