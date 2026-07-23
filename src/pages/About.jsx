import React from 'react';
import { Building2, Users, Award, ShieldCheck, Truck, Headphones, CheckCircle, Mail, Phone, MapPin, Star } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function About() {
  const googleReviews = [
    {
      name: "MALAY NIRAV",
      meta: "Local Guide · 13 reviews · 1 photo",
      time: "2 months ago",
      text: "Genuine supplier, Simple and smooth purchase experience. Just called them for quotation, They sent quotation, agreed on deal, paid through UPI and they sent product through rapido parcel."
    },
    {
      name: "Yash Thakur",
      meta: "Local Guide · 18 reviews · 42 photos",
      time: "11 months ago",
      text: "Aditya Enterprises is very good in terms of goods and recommendations that they give. Mr Aditya, personally interact with the clients and assist to their needs. Helps on Sundays to get the goods delivered and he is there till the goods are delivered. Process is complet"
    },
    {
      name: "Ankit Mangal",
      meta: "1 review",
      time: "5 months ago",
      text: "Quick response and very supportive team. Aditya Enterprise handled everything efficiently and made the process smooth. Highly recommended!"
    },
    {
      name: "Samriddhi Srikanth",
      meta: "3 reviews",
      time: "6 months ago",
      text: "Helped me with my urgent requirement so very promptly. Even helping with the delivery of the items.\nDefinitely recommend their services.\nThank you!"
    },
    {
      name: "Rajashekar Babaleshwar",
      meta: "8 reviews · 1 photo",
      time: "3 months ago",
      text: "Very good response and best price avaliable in Falcofix Products Like D3 WR Gold,WR, UM & Ebs WP1 PVC Glue Very good customer service on pricing🙏🙏🎉🎉"
    },
    {
      name: "Angel Sebastian",
      meta: "3 reviews",
      time: "a year ago",
      text: "Amazing service Aditya Enterprise. I got to know about Aditya Enterprise through google, they were really too quick in terms of package and transportation services. Such a good service, clear communication, high quality products at reasonable price. We are glad that we found such a great enterprise in Bengaluru."
    }
  ];

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
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>
                <strong>Aditya Enterprises</strong> is a leading manufacturer and channel partner of Pidilite Industries Ltd, Atul Ltd, Benson Polymer Ltd and Ozone hardware fitting and many more Adhesive related brands. We specialize in industrial adhesive tapes and surface protection solutions, serving diverse industries across India and global markets.
              </p>
              <p>
                With a strong commitment to quality, innovation, and customer satisfaction, we provide reliable tape solutions designed to improve productivity, enhance packaging performance, and protect valuable surfaces during manufacturing, storage, transportation, and installation. Our extensive product portfolio includes Surface Protection Films, Cross Filament Tapes, Double Sided Tissue Tapes, Double Sided Polyester Tapes, Green Polyester Masking Tapes, HDPE Tapes, Duct Tapes, Floor Marking Tapes, and other specialty adhesive products.
              </p>
              <p>
                Manufactured using premium-grade raw materials and advanced production processes, our tapes offer excellent adhesion, durability, temperature resistance, and consistent performance. Trusted by customers in packaging, automotive, construction, HVAC, electronics, metal fabrication, refrigeration, and engineering industries, we continue to deliver cost-effective and customized adhesive solutions that meet evolving industrial requirements.
              </p>
              <p>
                Our dedication to excellence, timely delivery, and continuous product development has established us as a preferred partner for businesses seeking high-performance industrial tapes and protective film solutions.
              </p>
              <div className="pt-4">
                <a 
                  href="https://share.google/fhMAACIVAMLSR57Rc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold rounded-xl shadow-sm hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-all group"
                >
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                  Click to visit my Google Profile
                </a>
              </div>
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

        {/* Google Reviews Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display flex items-center justify-center gap-1">
              <span className="text-blue-600">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-600">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
              <span className="text-slate-900 dark:text-white ml-2">Reviews</span>
            </h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              <span className="text-xl font-bold text-slate-800 dark:text-white mr-2">4.9 (551 reviews)</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-slate-500 mt-2 text-sm">Based on customer feedback</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {googleReviews.map((review, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg flex-shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.meta}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-xs text-slate-500 ml-2">{review.time}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-grow whitespace-pre-line">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
