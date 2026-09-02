const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

const targetStr = '<td className="py-4 font-semibold text-slate-800 dark:text-slate-200">{usr.company_name || \'N/A\'}</td>';
const replacementStr = '<td className="py-4 font-mono text-slate-450">{usr.phone || \'N/A\'}</td>\n                      <td className="py-4 font-semibold text-slate-800 dark:text-slate-200">{usr.company_name || \'N/A\'}</td>';

content = content.replace(targetStr, replacementStr);

fs.writeFileSync('src/pages/AdminDashboard.jsx', content);
