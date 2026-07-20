import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/supabase';
import { ImageIcon, Clock, Save, Upload, CheckCircle2, Plus, Trash2, Edit2 } from 'lucide-react';

export default function OfferPosterManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [posters, setPosters] = useState([]);
  const [editingPosterId, setEditingPosterId] = useState(null);
  
  // Current poster being edited/added
  const [currentPoster, setCurrentPoster] = useState({
    id: null,
    is_active: false,
    image_url: '',
    start_time: '',
    end_time: ''
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await api.offerPosters.list();
      
      // Normalize dates for the input fields
      const normalizedData = data.map(p => ({
        ...p,
        is_active: p.active, // map active to is_active for frontend UI
        start_time: p.start_date ? p.start_date.substring(0, 16) : '',
        end_time: p.end_date ? p.end_date.substring(0, 16) : ''
      }));
      
      setPosters(normalizedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const url = await api.storage.uploadFile(file, 'posters');
      setCurrentPoster(prev => ({ ...prev, image_url: url }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image. Make sure Supabase storage is configured correctly.');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveCurrentPoster = async () => {
    if (!currentPoster.image_url) {
      alert("Please upload an image first.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: editingPosterId === 'new' ? undefined : editingPosterId,
        image_url: currentPoster.image_url,
        active: currentPoster.is_active,
        start_date: currentPoster.start_time ? new Date(currentPoster.start_time).toISOString() : null,
        end_date: currentPoster.end_time ? new Date(currentPoster.end_time).toISOString() : null
      };

      await api.offerPosters.save(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      setEditingPosterId(null);
      setCurrentPoster({ id: null, is_active: false, image_url: '', start_time: '', end_time: '' });
      fetchSettings();
    } catch (err) {
      console.error(err);
      alert('Failed to save poster.');
    } finally {
      setSaving(false);
    }
  };

  const deletePoster = async (id) => {
    if (confirm("Are you sure you want to delete this poster?")) {
      try {
        await api.offerPosters.delete(id);
        fetchSettings();
      } catch (err) {
        alert("Failed to delete poster.");
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const poster = posters.find(p => p.id === id);
      if (!poster) return;
      await api.offerPosters.save({
        id: id,
        active: !currentStatus
      });
      fetchSettings();
    } catch (err) {
      console.error(err);
    }
  };

  const editPoster = (poster) => {
    setEditingPosterId(poster.id);
    setCurrentPoster({
      ...poster
    });
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold font-display flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-500" />
            Homepage Offer Posters (Popups)
          </h3>
          <p className="text-xs text-slate-500 mt-1">Manage multiple promotional posters. Active posters will be shown in a slider on the homepage.</p>
        </div>
        {!editingPosterId && (
          <button 
            onClick={() => setEditingPosterId('new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Poster
          </button>
        )}
      </div>

      {editingPosterId ? (
        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-800">
          <h4 className="font-bold mb-4">{editingPosterId === 'new' ? 'Add New Poster' : 'Edit Poster'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800">
                <div>
                  <span className="block text-sm font-bold">Enable Popup</span>
                  <span className="text-xs text-slate-500">Show poster to visitors</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={currentPoster.is_active}
                    onChange={e => setCurrentPoster({...currentPoster, is_active: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Timeframe Settings (Optional)
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">Start Time</label>
                    <input 
                      type="datetime-local" 
                      value={currentPoster.start_time}
                      onChange={e => setCurrentPoster({...currentPoster, start_time: e.target.value})}
                      className="w-full px-3 py-2 text-sm rounded-lg border dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-400">End Time</label>
                    <input 
                      type="datetime-local" 
                      value={currentPoster.end_time}
                      onChange={e => setCurrentPoster({...currentPoster, end_time: e.target.value})}
                      className="w-full px-3 py-2 text-sm rounded-lg border dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingPosterId(null);
                    setCurrentPoster({ id: null, is_active: false, image_url: '', start_time: '', end_time: '' });
                  }}
                  className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCurrentPoster}
                  disabled={saving || uploadingImage}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                  {saving ? 'Saving...' : <><Save className="h-4 w-4" /> Save</>}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase text-slate-400">Poster Image</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl overflow-hidden relative cursor-pointer transition-colors ${currentPoster.image_url ? 'border-transparent bg-slate-100 dark:bg-slate-900' : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'} flex items-center justify-center min-h-[200px]`}
              >
                {currentPoster.image_url ? (
                  <img src={currentPoster.image_url} alt="Offer Poster" className="w-full h-full object-contain max-h-[250px]" />
                ) : (
                  <div className="text-center p-6">
                    <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Click to upload poster image</span>
                    <span className="block text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Max 2MB)</span>
                  </div>
                )}
                
                {uploadingImage && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              {currentPoster.image_url && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setCurrentPoster({...currentPoster, image_url: ''})}
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posters.map((poster) => (
            <div key={poster.id} className="relative group bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="h-40 w-full bg-slate-200 dark:bg-slate-800 relative">
                {poster.image_url ? (
                  <img src={poster.image_url} alt="Poster" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => editPoster(poster)} className="p-1.5 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-50">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => deletePoster(poster.id)} className="p-1.5 bg-white text-red-600 rounded-lg shadow hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${poster.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {poster.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={poster.is_active}
                      onChange={() => toggleActive(poster.id, poster.is_active)}
                    />
                    <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="text-xs text-slate-500">
                  {poster.start_time && poster.end_time 
                    ? `${new Date(poster.start_time).toLocaleDateString()} - ${new Date(poster.end_time).toLocaleDateString()}`
                    : poster.start_time ? `From ${new Date(poster.start_time).toLocaleDateString()}` 
                    : poster.end_time ? `Until ${new Date(poster.end_time).toLocaleDateString()}`
                    : 'Always On'
                  }
                </div>
              </div>
            </div>
          ))}
          {posters.length === 0 && (
            <div className="col-span-full p-8 text-center border-2 border-dashed dark:border-slate-800 rounded-2xl text-slate-500">
              No posters uploaded yet. Click "Add Poster" to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
