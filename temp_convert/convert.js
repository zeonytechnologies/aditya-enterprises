const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('../.env', 'utf8');
const envVars = envFile.split('\n').reduce((acc, line) => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) acc[match[1].trim()] = match[2].trim();
  return acc;
}, {});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function convertAndUpload() {
  try {
    const pngBuffer = await sharp('../public/favicon.svg')
      .resize(1200, 1200, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();
    
    fs.writeFileSync('favicon-og.png', pngBuffer);
    console.log('Converted favicon to PNG');
    
    const { data, error } = await supabase.storage.from('aditya-assets').upload('public/favicon-og.png', pngBuffer, {
      contentType: 'image/png',
      upsert: true
    });
    
    if (error) {
      console.error('Upload failed:', error);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('aditya-assets').getPublicUrl('public/favicon-og.png');
      console.log('Favicon uploaded to:', publicUrl);
      
      let html = fs.readFileSync('../index.html', 'utf8');
      html = html.replace(/<meta property="og:image" content="[^"]+" \/>/, `<meta property="og:image" content="${publicUrl}" />`);
      fs.writeFileSync('../index.html', html);
      console.log('index.html updated with absolute favicon URL');
    }
  } catch (err) {
    console.error(err);
  }
}

convertAndUpload();
