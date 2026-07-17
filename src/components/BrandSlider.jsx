import React, { useState, useEffect } from 'react';
import { api } from '../services/supabase';

export default function BrandSlider() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await api.brands.list();
        setBrands(data);
      } catch (err) {
        console.error('Failed to load brands:', err);
      }
    };
    fetchBrands();
  }, []);

  if (brands.length === 0) return null;

  // Duplicate array for seamless infinite marquee loop
  const brandsList = [...brands, ...brands, ...brands];

  return (
    <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-900/40 py-8 border-y border-slate-100 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold font-sans">
          Authorized B2B Partner & Distributor
        </p>
      </div>

      <div className="flex w-[300%] md:w-[200%] animate-marquee">
        {brandsList.map((brand, index) => (
          <div 
            key={`${brand.id || brand.name}-${index}`} 
            className="flex-1 flex items-center justify-center px-8 md:px-16"
          >
            <div className="flex flex-col items-center space-y-1.5 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="h-16 w-32 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center justify-center overflow-hidden">
                <img 
                  src={brand.logo_url} 
                  alt={brand.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                {brand.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
