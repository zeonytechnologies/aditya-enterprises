const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('PriceList_1M8696_301_20260731154044 (1).pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('prices_parsed.txt', data.text);
    console.log('Parsed ' + data.text.split('\n').length + ' lines');
}).catch(function(err) {
    console.error(err);
});
