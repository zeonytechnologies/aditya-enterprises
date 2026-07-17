import React from 'react';
import { Building2, Users, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-sans pb-20">
      {/* Hero Section */}
      <div className="relative bg-slate-900 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&auto=format&fit=crop&q=80"
            alt="Aditya Enterprises Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-900/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold text-white font-display mb-6"
          >
            About Aditya Enterprises
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            Your trusted B2B partner and distributor for premium industrial adhesives, sealants, and hardware solutions since 2012.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-6">
              Who We Are
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Established with a vision to provide world-class industrial chemical and hardware solutions, <strong>Aditya Enterprises</strong> has grown into a leading distributor in the region. We cater to a diverse array of sectors including construction, automotive, aerospace, and furniture manufacturing.
              </p>
              <p>
                We are proud authorized channel partners for industry giants like <strong>Pidilite, 3M, Araldite, Kerakoll, and Ozone</strong>. Our commitment is not just to supply products, but to provide engineering solutions that guarantee structural integrity, efficiency, and longevity.
              </p>
              <p>
                With a state-of-the-art warehousing facility and a dedicated logistics network, we ensure timely deliveries for bulk and wholesale orders. Our team of technical experts is always ready to assist you with product selection, GST billing, and customized procurement plans.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <Building2 className="h-10 w-10 text-blue-600 dark:text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">10+</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Years Experience</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <Award className="h-10 w-10 text-blue-600 dark:text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">Top 5</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Authorized Brands</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <Users className="h-10 w-10 text-blue-600 dark:text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">500+</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">B2B Clients</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <ShieldCheck className="h-10 w-10 text-blue-600 dark:text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">100%</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Genuine Products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
