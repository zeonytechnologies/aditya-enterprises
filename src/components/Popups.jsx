import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/supabase';
import { sendEmail } from '../services/mailer';
import { useLocation } from 'react-router-dom';

export default function PopupsManager() {
  const location = useLocation();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [activeOffers, setActiveOffers] = useState([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  const [leadData, setLeadData] = useState({ name: '', mobile: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (showOffer && activeOffers.length > 1) {
      const timer = setInterval(() => {
        setCurrentOfferIndex(prev => (prev + 1) % activeOffers.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [showOffer, activeOffers.length]);

  useEffect(() => {
    // Only trigger on homepage
    if (location.pathname !== '/') return;
    const hasCaptured = localStorage.getItem('aditya_lead_captured');
    const hasSkipped = sessionStorage.getItem('aditya_lead_skipped');
    
    const fetchOffer = async () => {
      try {
        const rawOffers = await api.offerPosters.getActive();
        
        const validOffers = rawOffers.filter(offer => {
          if (!offer.active || !offer.image_url) return false;
          const now = new Date();
          const start = offer.start_date ? new Date(offer.start_date) : null;
          const end = offer.end_date ? new Date(offer.end_date) : null;
          if (start && now < start) return false;
          if (end && now > end) return false;
          return true;
        });

        setActiveOffers(validOffers);
        
        setTimeout(() => {
          if (!hasCaptured && !hasSkipped) {
            setShowLeadForm(true);
          } else if (validOffers.length > 0) {
            setShowOffer(true);
          }
        }, 3000);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchOffer();
  }, [location.pathname]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadData.name || !leadData.mobile) return;
    
    setIsSubmitting(true);
    try {
      await api.leads.submit(leadData);
      setIsSuccess(true);
      localStorage.setItem('aditya_lead_captured', 'true');
      
      // Send Welcome Email
      if (leadData.email) {
        sendEmail({
          to: leadData.email,
          subject: 'Welcome to Aditya Enterprises!',
          html: `
              <div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px; text-align: left;">
                <p style="color: #475569; font-size: 16px;">Our aditya Enterprises team representative will be in touch with you shortly to discuss wholesale price,</p>
                <p style="color: #475569; font-size: 16px;">If you have any questions about ordering online, please call us on <a href="https://wa.me/917483552250">wa.me/917483552250</a> and we would be happy to help you.</p>
                <br />
                <p style="color: #475569; font-size: 16px;">Thank you<br />
                Team:<br />
                ADITYA ENTERPRISES<br />
                Ckpgrouponline@gmail.com</p>
              </div>
            `
        }).catch(err => console.error("Mail send failed", err));
      }

      setTimeout(() => {
        setShowLeadForm(false);
        if (activeOffers.length > 0) {
          setShowOffer(true);
        }
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeLeadForm = () => {
    setShowLeadForm(false);
    sessionStorage.setItem('aditya_lead_skipped', 'true');
    if (activeOffers.length > 0) {
      setShowOffer(true);
    }
  };

  if (!showLeadForm && !showOffer) return null;

  return (
    <>
      {showLeadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={closeLeadForm}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="p-8">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">Thank You!</h3>
                  <p className="text-slate-500">We will reach out to you shortly with the best offers.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">Welcome to Aditya Enterprises!</h3>
                  <p className="text-sm text-slate-500 mb-6">Enter your details to get exclusive wholesale deals and updates.</p>
                  
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={leadData.name}
                        onChange={e => setLeadData({...leadData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Mobile Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={leadData.mobile}
                        onChange={e => setLeadData({...leadData, mobile: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        value={leadData.email}
                        onChange={e => setLeadData({...leadData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="name@company.com"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      {isSubmitting ? 'Submitting...' : (
                        <>Submit Details <Send className="h-4 w-4" /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showOffer && !showLeadForm && activeOffers.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowOffer(false)}>
          <div 
            className="relative max-w-2xl w-full animate-in fade-in zoom-in duration-300 flex items-center justify-center"
            onClick={e => e.stopPropagation()} 
          >
            <button 
              onClick={() => setShowOffer(false)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-slate-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            {/* Carousel Container */}
            <div className="relative w-full rounded-2xl shadow-2xl bg-white/5 overflow-hidden">
              <div className="relative w-full flex items-center justify-center">
                {activeOffers.map((offer, index) => (
                  <div 
                    key={offer.id || index}
                    className={`transition-opacity duration-500 w-full flex items-center justify-center ${index === currentOfferIndex ? 'relative opacity-100 z-10' : 'absolute inset-0 opacity-0 z-0 pointer-events-none'}`}
                  >
                    <img 
                      src={offer.image_url} 
                      alt={`Special Offer ${index + 1}`} 
                      className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
                    />
                  </div>
                ))}
              </div>
              
              {activeOffers.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentOfferIndex(prev => (prev - 1 + activeOffers.length) % activeOffers.length); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full z-20 transition-colors backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentOfferIndex(prev => (prev + 1) % activeOffers.length); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full z-20 transition-colors backdrop-blur-sm"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {activeOffers.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentOfferIndex(idx); }}
                        className={`h-2 rounded-full transition-all ${idx === currentOfferIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
