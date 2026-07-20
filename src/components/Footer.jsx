import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, FileCheck, Truck, Headphones } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import adityaLogo from '../assets/aditya-logo.png';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 font-sans">
      
      {/* Why Choose Us Badges section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-800 text-cyan-400 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">100% Genuine</h4>
              <p className="text-xs text-slate-500">Direct from premium brands</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-800 text-cyan-400 rounded-xl">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">GST Billing</h4>
              <p className="text-xs text-slate-500">Claim full input tax credit</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-800 text-cyan-400 rounded-xl">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Fast Delivery</h4>
              <p className="text-xs text-slate-500">Logistics dispatch in 24h</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-800 text-cyan-400 rounded-xl">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Expert Support</h4>
              <p className="text-xs text-slate-500">Chemical engineer assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <img src={adityaLogo} alt="Aditya Enterprises Logo" className="h-14 w-auto drop-shadow-lg mb-4 bg-white" />
            <p className="text-sm text-slate-500 leading-relaxed">
              Premier industrial adhesive and architectural hardware distributors. Serving structural engineering, manufacturing, packaging, and commercial interior industries since 2012.
            </p>
            <div className="flex space-x-3 pt-2">
              <span className="px-2.5 py-1 text-[10px] bg-slate-800 text-slate-300 font-bold rounded uppercase">ISO 9001:2015</span>
              <span className="px-2.5 py-1 text-[10px] bg-slate-800 text-slate-300 font-bold rounded uppercase">MSME Certified</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product Range</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop?category=adhesives" className="hover:text-white transition">Industrial Adhesives</Link></li>
              <li><Link to="/shop?category=sealants" className="hover:text-white transition">Silicone & PU Sealants</Link></li>
              <li><Link to="/shop?category=tapes" className="hover:text-white transition">B2B Heavy Duty Tapes</Link></li>
              <li><Link to="/shop?category=epoxy" className="hover:text-white transition">Epoxy Casting Resins</Link></li>
              <li><Link to="/shop?category=waterproofing" className="hover:text-white transition">Waterproofing Chemicals</Link></li>
              <li><Link to="/shop?category=hardware" className="hover:text-white transition">Architectural Hardware</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-white transition">Product Catalog</Link></li>
              <li><Link to="/#rfq" className="hover:text-white transition">Request B2B Quotation</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">User Panel</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Admin Portal</Link></li>
              <li><a href="#" className="hover:text-white transition">Dealer Registration</a></li>
              <li><a href="#" className="hover:text-white transition">Download Catalog PDFs</a></li>
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Corporate Office</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                <span className="text-slate-500">
                  3/1, S p road cross, near paan beeda shop HKK Lane, Medarpet, Kumbarpet, Hakkim khallel khan lane, Nagarathpete, Bengaluru, Karnataka 560002
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-blue-500" />
                <a href="tel:+917483552250" className="hover:text-white transition">074835 52250</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-blue-500" />
                <a href="mailto:adityaenterprises.ck@gmail.com" className="hover:text-white transition">adityaenterprises.ck@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Social Media Links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-500 mb-4 md:mb-0">Connect with us on social media for updates and offers.</p>
          <div className="flex space-x-6">
            <a href="https://www.instagram.com/ckp_group?utm_source=qr&igsh=cnN6eXE0eHB4eGQz" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
              <span className="sr-only">Instagram</span>
              <FaInstagram className="h-6 w-6" />
            </a>
            <a href="https://www.linkedin.com/in/chetan-jain-aa6956342?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
              <span className="sr-only">LinkedIn</span>
              <FaLinkedin className="h-6 w-6" />
            </a>
            <a href="https://youtube.com/@adityaenterprisesckp?si=UDxVEYIHphWdcBhS" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
              <span className="sr-only">YouTube</span>
              <FaYoutube className="h-6 w-6" />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="bg-slate-950 py-6 text-center text-xs text-slate-600 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p>© {new Date().getFullYear()} Aditya Enterprises. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">GST Terms & Conditions</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
