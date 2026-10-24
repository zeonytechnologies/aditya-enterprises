const fs = require('fs');
let code = fs.readFileSync('src/services/supabase.js', 'utf8');

const newSettingsGet = `    get: async () => {
      if (isSupabaseConfigured) {
        let dbData = null;
        try {
          const { data, error } = await supabase.from('website_settings').select('*').eq('id', 1).maybeSingle();
          if (!error && data) dbData = data;
        } catch(e) {}
        
        const localSettings = await db.getSettings() || {};
        return { ...localSettings, ...(dbData || {}) };
      } else {
        return await db.getSettings();
      }
    },`;

const newSettingsUpdate = `    update: async (settingsData) => {
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

code = code.replace(/get: async \(\) => \{[\s\S]*?\},[\s\n]*update: async \(settingsData\) => \{[\s\S]*?^\s*\}/m, newSettingsGet + '\n' + newSettingsUpdate);

fs.writeFileSync('src/services/supabase.js', code);
console.log('Settings API updated');
 