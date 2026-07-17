import React, { useState, useEffect } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { api } from '../services/supabase';

export default function Catalogues() {
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogues = async () => {
      try {
        const data = await api.catalogues.list();
        setCatalogues(data || []);
      } catch (err) {
        setError('Failed to load catalogues. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogues();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-display mb-4">
            Industrial Catalogues & PDF Guides
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Browse and download our latest technical catalogues, brochures, and specifications.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-cyan-400" />
            <p className="text-slate-500 text-sm font-medium">Loading catalogues...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        ) : catalogues.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
            <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Catalogues Available</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              We are currently updating our documentation. Check back soon for new catalogues.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogues.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-cyan-400 flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {cat.title}
                </h3>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow mb-6 line-clamp-3">
                  {cat.description}
                </p>

                <a
                  href={cat.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-700 dark:text-cyan-400 font-bold rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
