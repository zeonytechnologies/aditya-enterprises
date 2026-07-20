import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, FileSpreadsheet, Building2, HardHat, 
  Armchair, Car, Zap, ShieldAlert, Award, FileCheck, Truck, Headphones, Clock, Send
} from 'lucide-react';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { api } from '../services/supabase';
import BrandSlider from '../components/BrandSlider';
import ProductCard from '../components/ProductCard';

import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';

const HERO_SLIDES = [
  {
    title: "Premium Industrial Adhesives & Technical Sealants",
    subtitle: "Authorized Channel Partner (Distributor) of Pidilite, 3M, Araldite & Ozone. Certified GST billing and custom wholesale pricing for dealers.",
    bgImage: hero1,
    primaryBtn: "Browse Catalog",
    secondaryBtn: "Request Bulk Quote"
  },
  {
    title: "High-Performance Structural Bonding Solutions",
    subtitle: "Supplying double-sided VHB tapes, epoxy resins, and construction sealants for infrastructure, aerospace, and defense applications.",
    bgImage: hero2,
    primaryBtn: "View Epoxy & Tapes",
    secondaryBtn: "Get Dealer Price"
  }
];

const INDUSTRIES = [
  { name: 'Construction', icon: Building2, desc: 'Waterproofing & tile adhesives for structural slabs.' },
  { name: 'Architecture', icon: HardHat, desc: 'Hydraulic floor springs, patch fittings, and glass glues.' },
  { name: 'Furniture Manufacturing', icon: Armchair, desc: 'Wood glues, synthetic contact adhesives, wood fillers.' },
  { name: 'Automotive Industry', icon: Car, desc: 'High-temp gasket makers, body fillers, polyurethane sealants.' },
  { name: 'Electronics Industry', icon: Zap, desc: 'Thermal potting epoxies, kapton tapes, insulating sealants.' },
  { name: 'Defense & Aerospace', icon: ShieldAlert, desc: 'Mil-spec structural adhesives and high-stress threadlockers.' }
];

export default function Home() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [blogs, setBlogs] = useState([]);
  
  // Calculate initial time to midnight
  const getTimeToMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    const diff = midnight - now;
    
    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  };
  
  const [countdown, setCountdown] = useState(getTimeToMidnight());

  // Bulk RFQ Form State
  const [rfqForm, setRfqForm] = useState({
    companyName: '',
    gstNumber: '',
    email: '',
    phone: '',
    requirement: '',
    quantity: 100,
    fileName: '',
    fileUrl: ''
  });
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    // Load home page data
    const loadHomeData = async () => {
      try {
        const cats = await api.categories.list();
        setCategories(cats);

        const prods = await api.products.list();
        setFeaturedProducts(prods.filter(p => p.is_featured));
        setFlashDeals(prods.filter(p => p.is_flash_sale));

        const articles = await api.blogs.list();
        setBlogs(articles);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    loadHomeData();

    // Hero Slider Interval
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 8000);

    // Countdown Timer Interval
    const countdownTimer = setInterval(() => {
      setCountdown(getTimeToMidnight());
    }, 1000);

    return () => {
      clearInterval(slideTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  const handleRfqSubmit = async (e) => {
    e.preventDefault();
    if (!rfqForm.companyName || !rfqForm.email || !rfqForm.requirement) return;
    if (uploadingFile) {
      alert('Please wait until your specification file finishes uploading.');
      return;
    }

    try {
      const currentUser = api.auth.getCurrentUser();
      await api.rfqs.submit({
        user_id: currentUser?.id || null,
        company_name: rfqForm.companyName,
        gst_number: rfqForm.gstNumber,
        contact_email: rfqForm.email,
        contact_phone: rfqForm.phone,
        requirement: rfqForm.requirement,
        quantity: parseInt(rfqForm.quantity),
        file_url: rfqForm.fileUrl || null
      });

      setRfqSubmitted(true);
      setRfqForm({
        companyName: '',
        gstNumber: '',
        email: '',
        phone: '',
        requirement: '',
        quantity: 100,
        fileName: '',
        fileUrl: ''
      });
      setTimeout(() => setRfqSubmitted(false), 5000);
    } catch (err) {
      console.error('RFQ submission failed:', err);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRfqForm(prev => ({ ...prev, fileName: file.name }));
      setUploadingFile(true);
      try {
        const url = await api.storage.uploadFile(file, 'rfqs');
        setRfqForm(prev => ({ ...prev, fileUrl: url }));
      } catch (err) {
        console.error('File upload failed:', err);
        alert('Failed to upload specification sheet: ' + (err.message || err));
      } finally {
        setUploadingFile(false);
      }
    }
  };

  return (
    <div className="w-full pb-10 bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* 1. Large Hero Banner Slider */}
      <div className="relative h-[650px] w-full overflow-hidden bg-slate-900">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {/* Background image & gradient overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 30%, rgba(15, 23, 42, 0.4)), url(${slide.bgImage})` }}
            />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  <motion.span 
                    initial={{ opacity: 0, y: -20 }}
                    animate={idx === activeSlide ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-800/30 uppercase tracking-widest mb-6"
                  >
                    <Award className="h-3.5 w-3.5" /> B2C Industrial Marketplace
                  </motion.span>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={idx === activeSlide ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.1] mb-6"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={idx === activeSlide ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg text-slate-300 leading-relaxed mb-10"
                  >
                    {slide.subtitle}
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={idx === activeSlide ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link
                      to="/shop"
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-blue-600/30 flex items-center gap-2"
                    >
                      {slide.primaryBtn}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <a
                      href="#rfq"
                      className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition duration-300"
                    >
                      {slide.secondaryBtn}
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Floating Social Links */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 hidden sm:flex">
          <a href="https://www.instagram.com/ckp_group?utm_source=qr&igsh=cnN6eXE0eHB4eGQz" target="_blank" rel="noopener noreferrer" className="relative p-3 bg-white text-pink-600 rounded-full shadow-lg border border-slate-100 transition-all hover:scale-110 group">
            <FaInstagram className="h-5 w-5" />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Follow on Instagram</span>
          </a>
          <a href="https://www.linkedin.com/in/chetan-jain-aa6956342?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="relative p-3 bg-white text-[#0A66C2] rounded-full shadow-lg border border-slate-100 transition-all hover:scale-110 group">
            <FaLinkedin className="h-5 w-5" />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Connect on LinkedIn</span>
          </a>
          <a href="https://youtube.com/@adityaenterprisesckp?si=UDxVEYIHphWdcBhS" target="_blank" rel="noopener noreferrer" className="relative p-3 bg-white text-[#FF0000] rounded-full shadow-lg border border-slate-100 transition-all hover:scale-110 group">
            <FaYoutube className="h-5 w-5" />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Subscribe on YouTube</span>
          </a>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === activeSlide ? 'w-8 bg-blue-500' : 'w-2.5 bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. Trusted Brands Section */}
      <BrandSlider />

      {/* 3. Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Popular Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a specialized industrial segment to view products
            </p>
          </div>
          <Link to="/shop" className="text-blue-600 dark:text-cyan-400 font-bold text-sm flex items-center hover:opacity-85 mt-2 md:mt-0">
            View All Catalog <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative flex flex-col justify-end h-64 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-900"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.9) 30%, rgba(15, 23, 42, 0.1)), url(${cat.image_url})` }}
              />
              <div className="relative z-10 p-5">
                <span className="inline-block text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1.5">
                  Category Segment
                </span>
                <h3 className="text-lg font-bold text-white font-display">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 leading-snug opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-12 transition-all duration-300 overflow-hidden mt-1">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Today's Deals / Flash Sale Section */}
      {flashDeals.length > 0 && (
        <section className="bg-gradient-to-r from-blue-900/10 via-cyan-900/10 to-blue-900/10 dark:from-slate-900/30 dark:to-slate-900/30 py-16 border-y border-slate-200/50 dark:border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="px-3.5 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Flash Sale
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  Today's Wholesale Deals
                </h2>
              </div>
              
              {/* Countdown Timer */}
              <div className="flex items-center space-x-3 mt-4 md:mt-0 font-display">
                <span className="text-xs text-slate-500 font-bold uppercase mr-1">Offer Ends In:</span>
                <div className="flex space-x-1.5">
                  <div className="h-9 w-9 bg-slate-900 dark:bg-slate-850 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {String(countdown.hours).padStart(2, '0')}
                  </div>
                  <span className="text-slate-900 dark:text-white font-bold">:</span>
                  <div className="h-9 w-9 bg-slate-900 dark:bg-slate-850 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-slate-900 dark:text-white font-bold">:</span>
                  <div className="h-9 w-9 bg-slate-900 dark:bg-slate-850 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {flashDeals.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Featured B2B Catalog
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Top performance industrial formulations in stock and available for GST credit claims
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. Industries We Serve Section */}
      <section id="industries" className="bg-slate-900 py-20 text-white border-y border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs text-blue-500 font-bold uppercase tracking-wider">Target Segments</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display mt-2">
              Industries We Serve
            </h2>
            <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
              Our adhesive and fitting catalog covers specialized chemical standards compliant with industrial, commercial, and engineering certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {INDUSTRIES.map((ind, idx) => {
              const IconComp = ind.icon;
              return (
                <div 
                  key={idx}
                  onClick={() => navigate(`/shop?industry=${encodeURIComponent(ind.name)}`)}
                  className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all duration-300 cursor-pointer flex flex-col items-start"
                >
                  <div className="p-3 bg-slate-700 rounded-xl text-blue-500 dark:text-cyan-400 group-hover:bg-blue-600 group-hover:text-white transition duration-300 mb-4">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                    {ind.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Bulk Quotation (RFQ) Section */}
      <section id="rfq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-50 text-blue-800 dark:bg-slate-900 dark:text-cyan-400 text-xs font-bold uppercase">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Direct RFQ Portal
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white font-display leading-tight">
              Request a Bulk Custom Quotation
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Submit your project specifications or required brand bulk counts (e.g. Pidilite, Kerakoll, Araldite). Our technical sales engineers will construct a formal wholesale pricing quotation proposal contract and attach it to your panel.
            </p>
            
            <div className="space-y-4 pt-4 text-xs font-semibold text-slate-650 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <span>Wholesale volume-based contract prices</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <span>GST Tax Credit Compliant documentation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <span>Custom logistics shipping routes for freight quantities</span>
              </div>
            </div>
          </div>

          {/* Quotation Form Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            {rfqSubmitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="h-16 w-16 bg-green-50 dark:bg-green-950/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <FileCheck className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">RFQ Submitted Successfully!</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Thank you! We have logged your request. Our procurement desk will contact you via email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mehta Fabricators Ltd"
                      value={rfqForm.companyName}
                      onChange={(e) => setRfqForm(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GSTIN (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      value={rfqForm.gstNumber}
                      onChange={(e) => setRfqForm(prev => ({ ...prev, gstNumber: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. procurement@mehta.com"
                      value={rfqForm.email}
                      onChange={(e) => setRfqForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={rfqForm.phone}
                      onChange={(e) => setRfqForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Required Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={rfqForm.quantity}
                    onChange={(e) => setRfqForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specify Requirements *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="e.g. Requesting 500 Tubs of Fevicol SH 1Kg, and 50 rolls of 3M VHB Tape 4910."
                    value={rfqForm.requirement}
                    onChange={(e) => setRfqForm(prev => ({ ...prev, requirement: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Simulated File Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload BOQ / Spec Sheet (PDF, XLSX)</label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-700">
                      Choose File
                      <input 
                        type="file" 
                        accept=".pdf,.xlsx,.xls,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden" 
                      />
                    </label>
                    <span className="text-xs text-slate-400 truncate">
                      {uploadingFile ? 'Uploading to Supabase...' : (rfqForm.fileName || 'No file selected')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Send className="h-4 w-4" /> Submit Quotation Request
                </button>

              </form>
            )}
          </div>

        </div>
      </section>

      {/* 8. Technical Blogs Section */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-150 dark:border-slate-850">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                Latest Technical Insights
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Adhesive engineering manuals and architectural installation guidelines
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((post) => (
              <div 
                key={post.id}
                className="group flex flex-col md:flex-row bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="md:w-2/5 h-48 md:h-full relative overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                  />
                </div>
                <div className="md:w-3/5 p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-slate-950 dark:text-cyan-400 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-450 line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 flex justify-between items-center">
                    <span>By {post.author}</span>
                    <span>{new Date(post.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10">
        <div className="bg-slate-900 dark:bg-slate-900/60 border border-slate-850 rounded-3xl px-8 py-10 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white font-display">Stay Updated with Catalog Stocks</h3>
            <p className="text-sm text-slate-400 mt-1">Get notifications on stock alerts, new brand arrivals, and seasonal coupons.</p>
          </div>
          <div className="flex w-full lg:w-auto max-w-md gap-3">
            <input
              type="email"
              placeholder="Enter your business email"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none text-sm"
            />
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm transition hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
