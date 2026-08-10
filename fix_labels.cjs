const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

content = content.replace('<th className="py-3 text-right">Standard Price</th>', '<th className="py-3 text-right">Basic Price</th>');
content = content.replace('<th className="py-3 text-right">Dealer Price</th>', '<th className="py-3 text-right">Dealer Landing Price</th>');
content = content.replace(/Retail Price \*/g, 'Basic Price *');
content = content.replace(/Dealer Price \*/g, 'Dealer Landing Price *');
content = content.replace(/Dealer B2B Price/g, 'Dealer Landing Price');

fs.writeFileSync('src/pages/AdminDashboard.jsx', content);
console.log('Replacements done.');
