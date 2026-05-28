import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Navigation } from 'lucide-react';
import { CLINIC_INFO } from '../data';

export default function Contact() {
  const contactCards = [
    {
      icon: <MapPin className="h-6 w-6 text-blue-600 shrink-0" />,
      title: "Clinic Address",
      details: CLINIC_INFO.address,
      subtitle: `Landmark: ${CLINIC_INFO.landmark}`
    },
    {
      icon: <Phone className="h-6 w-6 text-blue-600 shrink-0" />,
      title: "Phone Submissions",
      details: `${CLINIC_INFO.phone}`,
      secondaryDetails: `Alt Line: ${CLINIC_INFO.secondaryPhone}`,
      subtitle: "Prior tele-booking highly recommended to bypass general rush hour slots."
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600 shrink-0" />,
      title: "Clinic Timings",
      details: CLINIC_INFO.timings,
      subtitle: "Closed only on declared gazetted national holidays."
    }
  ];

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-extrabold text-xs tracking-wider uppercase font-sans">
            Need Directions?
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">
            Reach Out & Get Diagnosed
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-slate-500 mt-4 text-base sm:text-lg">
            Our diagnostic team operates in the heart of Sector 31 HUDA market, easily accessible via Gurgaon principal pathways.
          </p>
        </div>

        {/* Info + Maps Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Block: Communication cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-6">
              <h3 className="font-display font-bold text-slate-900 text-xl sm:text-2xl leading-tight">
                Centrally Positioned For Easy Access
              </h3>
              
              <div className="space-y-6">
                {contactCards.map((card, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white p-5 rounded-2xl border border-slate-100 flex gap-4 shadow-xs"
                  >
                    <div className="bg-blue-50 p-2.5 rounded-xl h-11 w-11 flex items-center justify-center shrink-0">
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                        {card.title}
                      </h4>
                      <p className="font-sans text-slate-700 text-sm mt-1.5 font-semibold">
                        {card.details}
                      </p>
                      {card.secondaryDetails && (
                        <p className="font-sans text-slate-700 text-sm font-semibold mt-0.5">
                          {card.secondaryDetails}
                        </p>
                      )}
                      {card.subtitle && (
                        <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inbound support assistance card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-2xl">
              <div className="flex gap-2 items-center text-blue-800 font-extrabold text-xs uppercase tracking-wider mb-2 font-display">
                <ShieldCheck className="h-4.5 w-4.5" />
                <span>Emergency Radiologist Contact</span>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                For complex queries or emergency scanning requests representing severe abdominal cramps or trimester concerns, please dial our direct line or have your consulting physician connect with Dr. Sandeep Sharma directly.
              </p>
            </div>

          </div>

          {/* Right Block: Live Responsive Google Map Frame */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 min-h-[360px] lg:min-h-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg bg-zinc-100">
              <iframe 
                src={CLINIC_INFO.googleMapEmbed} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bharat Ultrasound and Diagnostic Centre Map Location Sector 31 Gurugram"
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {/* Quick buttons to launch map directions */}
            <div className="mt-4 flex flex-wrap gap-3">
              <a 
                href="https://maps.app.goo.gl/dSp6j72dFscunwWGA" // Sector 31 Market redirection link
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Navigation className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                <span>Open in Google Maps App</span>
              </a>
              <a 
                href="mailto:info@bharatdiagnostic.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span>{CLINIC_INFO.email}</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
