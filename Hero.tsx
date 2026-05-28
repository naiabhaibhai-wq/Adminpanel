import { motion } from 'motion/react';
import { Phone, MessageCircle, Calendar, ShieldCheck, Award, Timer, BadgeInfo } from 'lucide-react';
import { CLINIC_INFO } from '../data';
import { useLanguage } from '../LanguageContext';
import LiveClinicStatus from './LiveClinicStatus';

interface HeroProps {
  onBookClick: () => void;
}

export default function Hero({ onBookClick }: HeroProps) {
  const { t, language } = useLanguage();

  return (
    <section 
      id="hero" 
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white"
    >
      {/* Background blobs for a modern visual feel */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 bottom-12 w-80 h-80 bg-teal-50/50 rounded-full blur-3xl pointer-events-none" />
      
      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dynamic IST Live Clinic Status Bar */}
        <div className="mb-10 max-w-4xl">
          <LiveClinicStatus />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Intro, Heading, Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 md:space-y-8 text-left">
            
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-250 text-blue-750 font-bold text-xs tracking-wide uppercase"
            >
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>{t('hero_tag')}</span>
            </motion.div>
 
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[50px] tracking-tight text-slate-905 leading-tight">
                {language === 'hi' ? "भारत अल्ट्रासाउंड" : "Bharat Ultrasound"}<br className="hidden sm:inline" />
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {language === 'hi' ? "एंड डायग्नोस्टिक सेंटर" : "& Diagnostic Centre"}
                </span>
              </h1>
              <p className="font-sans text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                {t('hero_descr')}
              </p>
            </motion.div>
 
            {/* Quick trust highlights */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full"
            >
              <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-slate-100 shadow-xs">
                <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-slate-800 text-xs leading-normal">{t('about_dr_degree')}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{t('hero_stat_exp')}</div>
                </div>
              </div>
 
              <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-slate-100 shadow-xs">
                <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg shrink-0">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-slate-800 text-xs leading-normal">{t('hero_stat_time')}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{language === 'hi' ? "तुरंत प्रिंटेड कॉपियां" : "Instant printed copies"}</div>
                </div>
              </div>
 
              <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-slate-100 shadow-xs">
                <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-slate-800 text-xs leading-normal">{language === 'hi' ? "PC-PNDT स्वीकृत" : "PC-PNDT Approved"}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{language === 'hi' ? "100% नैतिक और सुरक्षित" : "100% Legal & Ethical"}</div>
                </div>
              </div>
            </motion.div>
 
            {/* Direct CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <button
                onClick={onBookClick}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 hover:shadow-lg transition-all text-center cursor-pointer"
              >
                <Calendar className="h-4.5 w-4.5" />
                <span>{t('hero_book_online')}</span>
              </button>
 
              <a
                href={`tel:${CLINIC_INFO.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-xl text-sm transition-all hover:border-slate-300 text-center shadow-xs"
              >
                <Phone className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
                <span>{t('hero_call_now')}{CLINIC_INFO.phone}</span>
              </a>
 
              <a
                href={`https://wa.me/${CLINIC_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I would like to book a scan at Bharat Ultrasound Centre`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all text-center"
              >
                <MessageCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{t('hero_book_whatsapp')}</span>
              </a>
            </motion.div>
 
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-2 max-w-lg leading-relaxed border-t border-slate-100 pt-3"
            >
              <BadgeInfo className="h-4 w-4 text-red-500 shrink-0" />
              <span>{language === 'hi' ? "सरकारी चेतावनी: कानूनी तौर पर लिंग जाँच पूर्णतः प्रतिबंधित एवं दंडनीय अपराध है।" : "PC-PNDT Mandate: Fetal sex determination is strictly illegal and a punishable offence."}</span>
            </motion.div>
 
          </div>
 
          {/* Right Block: Image with Glassmorphism Overlay */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center items-center w-full"
          >
            {/* Abstract Background Design Elements */}
            <div className="absolute inset-0 bg-blue-600/5 rounded-3xl transform rotate-3" />
            <div className="absolute inset-0 bg-blue-100/30 rounded-3xl transform -rotate-2" />
            
            {/* Main Visual Image Card */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
              <img 
                src="https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=1200&q=80" 
                alt="State-of-the-art ultrasound scanner diagnostic scan session"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              
              {/* Glassmorphic Indicator Overlay 1 - Premium Designed Doctor Bio */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-[0_8px_32px_rgba(30,41,59,0.12)] border border-blue-100/60 shadow-blue-500/10">
                <div className="flex items-center gap-3">
                  {/* Verified badge with soft blue glow */}
                  <div className="relative flex items-center justify-center bg-blue-50/80 text-blue-600 p-2.5 rounded-xl border border-blue-100/70 shadow-[0_0_15px_rgba(59,130,246,0.15)] shrink-0">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    {/* Ring indicator ping */}
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-display font-extrabold text-slate-900 text-sm tracking-tight truncate">
                        {t('about_dr_name')}, {language === 'hi' ? "एमडी" : "MD"}
                      </h4>
                      <span className="inline-flex items-center text-[9px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wide shrink-0">
                        Verified MD
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-semibold font-sans leading-normal truncate">
                      {language === 'hi' ? "वरिष्ठ रेडियोलॉजिस्ट | १८+ वर्ष अनुभव" : "Senior Radiologist | 18+ Yrs Experience"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
 
        </div>
      </div>
    </section>
  );
}
