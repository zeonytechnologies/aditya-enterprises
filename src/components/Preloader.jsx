import React, { useEffect, useState } from 'react';
import preloaderLogo from '../assets/preloader-logo.jpg';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Keep it on screen for a slightly longer time to show the sleek animation
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2800);

    // Completely remove from DOM
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 transition-all duration-700 ease-in-out ${
        isFading ? 'opacity-0 scale-110 blur-md' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative flex flex-col items-center z-10 animate-fade-in-up">
        {/* Animated Ring Wrapper */}
        <div className="relative p-1 rounded-2xl group">
          {/* Spinning Gradient Border */}
          <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] animate-spin" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_0deg,transparent_0_340deg,#3b82f6_360deg)] animate-spin blur-sm" style={{ animationDuration: '2s' }}></div>
          
          {/* Inner masking to hide the center of the gradient */}
          <div className="absolute inset-1 rounded-2xl bg-slate-950"></div>

          {/* Actual Logo Image */}
          <div className="relative h-40 w-40 sm:h-48 sm:w-48 rounded-2xl overflow-hidden border-4 border-slate-900/50 shadow-2xl">
            <img 
              src={preloaderLogo} 
              alt="Aditya Enterprises Loading" 
              className="w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-110 ease-out"
              style={{
                animation: 'pulseScale 2s infinite alternate ease-in-out'
              }}
            />
          </div>
        </div>
        
        {/* Modern Typography Loading Text */}
        <div className="mt-8 flex flex-col items-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-[0.3em] uppercase bg-gradient-to-r from-slate-400 via-white to-slate-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
            ADITYA ENTERPRISES
          </h1>
          
          {/* Minimalist Progress Line */}
          <div className="w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 rounded-full animate-progress-fast"></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes progress-fast {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 100%; transform: translateX(100%); }
        }
        @keyframes pulseScale {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .animate-progress-fast {
          animation: progress-fast 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
