import React from 'react';

const BRANDS = [
  { name: '3M', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=200&auto=format&fit=crop&q=80' },
  { name: 'Pidilite', logo: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=200&auto=format&fit=crop&q=80' },
  { name: 'Fevicol', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80' },
  { name: 'Kerakoll', logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80' },
  { name: 'Ozone', logo: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=200&auto=format&fit=crop&q=80' },
  { name: 'Araldite', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80' },
  { name: 'Lapox', logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80' },
  { name: 'Bostik', logo: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=200&auto=format&fit=crop&q=80' }
];

export default function BrandSlider() {
  // Duplicate array for seamless infinite marquee loop
  const brandsList = [...BRANDS, ...BRANDS, ...BRANDS];

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
            key={`${brand.name}-${index}`} 
            className="flex-1 flex items-center justify-center px-8 md:px-16"
          >
            <div className="flex flex-col items-center space-y-1.5 opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="h-12 w-28 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex items-center justify-center p-2.5 overflow-hidden">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-h-full max-w-full object-contain filter grayscale dark:invert contrast-125" 
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
