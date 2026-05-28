import React from 'react';
import { Activity, Mail, Phone, MapPin, Facebook, Heart, ShieldCheck, Lock } from 'lucide-react';
import { CLINIC_INFO } from '../data';

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleQuickLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer id="footer-section" className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footers columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand block (Span 4) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg tracking-tight leading-tight">
                  BHARAT
                </span>
                <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
                  Ultrasound & Diagnostics
                </span>
              </div>
            </div>
            <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed">
              Serving citizens across Gurugram, India with unparalleled diagnostic fidelity, state-of-the-art ultrasound imaging systems, and verified clinical reports.
            </p>
            {/* Accreditation details */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-sans border-t border-slate-800 pt-3">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-400 shrink-0" />
              <span>MCG Licenced, PC-PNDT Approved Centre</span>
            </div>
          </div>

          {/* Quick links block (Span 2) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="font-display font-bold text-slate-100 text-sm sm:text-base uppercase tracking-wider">
              Navigation
            </h4>
            <div className="flex flex-col gap-2">
              <a href="#about" onClick={(e) => handleQuickLink(e, "#about")} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">About Us</a>
              <a href="#services" onClick={(e) => handleQuickLink(e, "#services")} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Our Services</a>
              <a href="#convenience" onClick={(e) => handleQuickLink(e, "#convenience")} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Patient Comfort</a>
              <a href="#why-us" onClick={(e) => handleQuickLink(e, "#why-us")} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Why Choose Us</a>
              <a href="#reviews" onClick={(e) => handleQuickLink(e, "#reviews")} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Patient Reviews</a>
              <a href="#contact" onClick={(e) => handleQuickLink(e, "#contact")} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Address Map</a>
            </div>
          </div>

          {/* Specialities (Span 3) */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <h4 className="font-display font-bold text-slate-100 text-sm sm:text-base uppercase tracking-wider">
              Core Specialities
            </h4>
            <div className="flex flex-col gap-2">
              <span className="text-xs sm:text-sm text-slate-400">Whole Abdomen Ultrasound</span>
              <span className="text-xs sm:text-sm text-slate-400">Level II pregnancy anomalies scan</span>
              <span className="text-xs sm:text-sm text-slate-400">Whole Body Checkup Profile</span>
              <span className="text-xs sm:text-sm text-slate-400">Diabetes / Thyroid panels</span>
              <span className="text-xs sm:text-sm text-slate-400">Follicular Scanning tracker</span>
              <span className="text-xs sm:text-sm text-slate-400">Ultrasound Color Doppler</span>
            </div>
          </div>

          {/* Contact specs (Span 3) */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <h4 className="font-display font-bold text-slate-100 text-sm sm:text-base uppercase tracking-wider">
              Diagnostic Desk
            </h4>
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-400 font-sans">
              <div className="flex gap-2 items-start">
                <MapPin className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                <span>{CLINIC_INFO.address}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                <span>{CLINIC_INFO.phone}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Mail className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                <span>{CLINIC_INFO.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer block & Copyright section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p className="text-[10px] text-slate-500 font-sans max-w-2xl leading-relaxed">
              <strong>Statutory PC-PNDT Regulatory Warning:</strong> Bharat Ultrasound And Diagnostic Centre strictly prohibits and never conducts fetal gender selection or sex determination scans. It is a severe cognizable offense punishable under Indian PNDT laws.
            </p>
            <p className="text-[10px] text-slate-500 font-sans">
              &copy; {currentYear} Bharat Ultrasound And Diagnostic Centre. All Rights Reserved. Created in compliance with MCG standards.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 shrink-0 animate-pulse" />
            <span>in Haryana, India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
