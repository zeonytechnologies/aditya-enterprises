import React from 'react';
import { Building2, Users, Award, ShieldCheck, Truck, Headphones, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
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
            Your trusted B2B partner and Channel Partner (Distributor) for premium industrial adhesives, sealants, and hardware solutions since 2012.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Company Info Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-6">
              Our Journey & Vision
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Established with a vision to provide world-class industrial chemical and hardware solutions, <strong>Aditya Enterprises</strong> has grown into a leading Channel Partner (Distributor) in the region. We cater to a diverse array of sectors including construction, automotive, aerospace, and furniture manufacturing.
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
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:border-blue-500 transition-colors">
              <Building2 className="h-10 w-10 text-blue-600 dark:text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">26+</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Years Experience</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:border-blue-500 transition-colors">
              <Award className="h-10 w-10 text-blue-600 dark:text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">Top Brands</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Authorized Channel Partners</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:border-blue-500 transition-colors">
              <Users className="h-10 w-10 text-blue-600 dark:text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">1,500+</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">B2B Clients</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-center hover:border-blue-500 transition-colors">
              <ShieldCheck className="h-10 w-10 text-blue-600 dark:text-cyan-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">100%</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Genuine Products</p>
            </div>
          </div>
        </section>

        {/* Service Guidance Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-4">Service Guidance & Procurement</h2>
            <p className="text-slate-500">We streamline your industrial sourcing with dedicated B2B services, ensuring you get the right product at the right time.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Wholesale & Bulk Orders</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We specialize in fulfilling large-scale requirements for factories, construction sites, and retail dealers. Benefit from our tiered pricing and deep inventory reserves.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Pan-India Logistics</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our robust supply chain ensures that your materials reach your site safely. We handle specialized transport for chemical goods maintaining required safety protocols.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Technical Consultation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Not sure which adhesive suits your substrate? Our technical team provides on-call and on-site guidance to help you select the optimal product for your specific application.
              </p>
            </div>
          </div>
        </section>

        {/* Support & Contact Details */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mb-2">Get In Touch</h2>
            <p className="text-slate-500 mb-8">Our support team is available Monday through Saturday to assist with your inquiries, quotations, and order tracking.</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Head Office</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">123 Industrial Estate, Phase II<br/>Bangalore, Karnataka 560001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Phone & WhatsApp</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">+91 93422 48827</p>
                  <a href="https://wa.me/919342248827" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-bold mt-2 inline-block hover:underline">Chat on WhatsApp &rarr;</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Email Support</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">adityaenterprises.ck@gmail.com</p>
                </div>
              </div>

              {/* Social Media Links in About */}
              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/ckp_group?utm_source=qr&igsh=cnN6eXE0eHB4eGQz" target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-slate-400 hover:text-pink-600 rounded-full shadow-lg border border-slate-100 transition-colors">
                    <FaInstagram className="h-6 w-6" />
                  </a>
                  <a href="https://www.linkedin.com/in/chetan-jain-aa6956342?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-full shadow-lg border border-slate-100 transition-colors">
                    <FaLinkedin className="h-6 w-6" />
                  </a>
                  <a href="https://youtube.com/@adityaenterprisesckp?si=UDxVEYIHphWdcBhS" target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-slate-400 hover:text-red-600 rounded-full shadow-lg border border-slate-100 transition-colors">
                    <FaYoutube className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-48 w-48 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold font-display mb-4">Request a Callback</h3>
              <p className="text-sm text-slate-300 mb-6">Drop your details and our B2B sales representative will get back to you within 2 working hours.</p>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Callback requested successfully!'); }}>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Full Name</label>
                  <input type="text" required className="w-full bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Mobile Number</label>
                  <input type="tel" required className="w-full bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Company / Inquiry Type</label>
                  <input type="text" required className="w-full bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Bulk Order for Araldite" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors mt-2">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
