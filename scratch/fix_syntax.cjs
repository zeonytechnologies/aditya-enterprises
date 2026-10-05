const fs = require('fs');
let code = fs.readFileSync('src/services/supabase.js', 'utf8');

const regex = /update: async \(settingsData\) => \{[\s\S]*?\} else \{\s*return await db\.saveSettings\(settingsData\);\s*\}\s*\}/;

const fixedUpdate = `update: async (settingsData) => {
      let savedData = settingsData;
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('website_settings').upsert({ id: 1, ...settingsData }).select().single();
          if (error) throw error;
          savedData = data;
        } catch (err) {
          console.warn('Supabase settings update failed, falling back to local DB', err);
        }
      }
      return await db.saveSettings(settingsData);
    }`;

code = code.replace(regex, fixedUpdate);
fs.writeFileSync('src/services/supabase.js', code);
console.log('Fixed syntax error');
