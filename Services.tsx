import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Eye, 
  ClipboardCheck, 
  ShieldCheck, 
  Info, 
  Clock, 
  ChevronRight, 
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SERVICES } from '../data';
import { Service } from '../types';
import { useLanguage } from '../LanguageContext';

interface ServicesProps {
  onBookService: (serviceName: string) => void;
}

const ServiceIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'Activity':
      return <Activity className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Thermometer':
      return <Thermometer className={className} />;
    case 'Eye':
      return <Eye className={className} />;
    case 'ClipboardCheck':
      return <ClipboardCheck className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    default:
      return <Activity className={className} />;
  }
};

export default function Services({ onBookService }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'scans' | 'pregnancy' | 'pathology'>('all');
  const { t, language } = useLanguage();

  const handleInfoClick = (service: Service, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedService(service);
  };

  const getLocalizedService = (service: Service): Service => {
    switch (service.id) {
      case 'ultrasound':
        return {
          ...service,
          category: language === 'hi' ? "अल्ट्रासाउंड स्कैन" : "Scans",
          title: t('serv_usg_title'),
          description: t('serv_usg_desc'),
          detailedDescription: t('serv_usg_detail'),
          priceEstimate: language === 'hi' ? "₹999 से शुरू" : "Starts at ₹999",
          preparationTips: language === 'hi' ? [
            "ऊपरी पेट / केयूबी (KUB) स्कैन के लिए, जाँच से कम से कम 6-8 घंटे पहले पूर्ण उपवास जरूरी है (पानी पी सकते हैं)।",
            "पेल्विक / फॉलिक्युलर स्कैन के लिए पेशाब का दबाव होना आवश्यक है। स्कैन से 1 घंटे पहले 4-5 गिलास पानी पीएं और पेशाब न करें।"
          ] : service.preparationTips
        };
      case 'pregnancy-scan':
        return {
          ...service,
          category: language === 'hi' ? "गर्भावस्था स्कैन" : "Specialized Scans",
          title: t('serv_preg_title'),
          description: t('serv_preg_desc'),
          detailedDescription: t('serv_preg_detail'),
          priceEstimate: language === 'hi' ? "₹1,499 से शुरू" : "Starts at ₹1,499",
          preparationTips: language === 'hi' ? [
            "ढीले और आरामदायक दो-पीस सूती कपड़े पहनें (कुर्ता-सलवार या शर्ट-पेंट)।",
            "शुरुआती तीन महीनों के गर्भावस्था स्कैन के लिए पेशाब का हल्का दबाव आवश्यक रहता है। जाँच से 1 घंटा पहले 3-4 गिलास पानी पीएं।",
            "अपने सभी पुराने अल्ट्रासाउंड और डॉक्टर के नुस्खे (Prescriptions) साथ लाना न भूलें।"
          ] : service.preparationTips
        };
      case 'blood-test':
        return {
          ...service,
          category: language === 'hi' ? "पैथोलॉजी जाँच" : "Diagnostics",
          title: t('serv_blood_title'),
          description: t('serv_blood_desc'),
          detailedDescription: t('serv_blood_detail'),
          priceEstimate: language === 'hi' ? "₹299 से शुरू" : "Starts at ₹299",
          preparationTips: language === 'hi' ? [
            "ब्लड शुगर (Fasting) और कोलेस्ट्रॉल (Lipid Profile) के लिए 10-12 घंटे का उपवास अनिवार्य हैजी।",
            "उपवास के दौरान कॉफी, चाय, या धूम्रपान का सेवन बिल्कुल न करें और हाइड्रेटेड रहें।"
          ] : service.preparationTips
        };
      case 'routine-scanning':
        return {
          ...service,
          category: language === 'hi' ? "ऑर्गन स्क्रीनिंग" : "Scans",
          title: t('serv_vital_title'),
          description: t('serv_vital_desc'),
          detailedDescription: t('serv_vital_detail'),
          priceEstimate: language === 'hi' ? "₹799 से शुरू" : "Starts at ₹799",
          preparationTips: language === 'hi' ? [
            "हल्का भोजन करने की सलाह दी जाती है, अस्वस्थ तली-भुनी चीजों से रात में परहेज रखें।"
          ] : service.preparationTips
        };
      case 'health-checkups':
        return {
          ...service,
          category: language === 'hi' ? "हेल्थ पैकेज" : "Wellness",
          title: t('serv_pkg_title'),
          description: t('serv_pkg_desc'),
          detailedDescription: t('serv_pkg_detail'),
          priceEstimate: language === 'hi' ? "₹1,999 से शुरू" : "Starts at ₹1,999",
          preparationTips: language === 'hi' ? [
            "रात के बाद 12 घंटे का सघन उपवास अनिवार्य है जी।",
            "सुबह मिड-स्ट्रीम पेशाब का पहला सैंपल हमारे रिसेप्शन पर उपलब्ध बाँझ कंटेनर में जमा करें।"
          ] : service.preparationTips
        };
      case 'specialist-diagnostics':
        return {
          ...service,
          category: language === 'hi' ? "विशेष जाँचे" : "Diagnostics",
          title: t('serv_diag_title'),
          description: t('serv_diag_desc'),
          detailedDescription: t('serv_diag_detail'),
          priceEstimate: language === 'hi' ? "₹499 से शुरू" : "Starts at ₹499",
          preparationTips: language === 'hi' ? [
            "ईसीजी कराने से कम से कम 2 घंटे पहले तक कोई भी भारी कसरत न करें।"
          ] : service.preparationTips
        };
      default:
        return service;
    }
  };

  const localizedServices = SERVICES.map(getLocalizedService);

  // Filter based on tabs
  const filteredServices = localizedServices.filter(s => {
    if (activeTab === 'all') return true;
    if (activeTab === 'scans') return s.id === 'ultrasound' || s.id === 'routine-scanning';
    if (activeTab === 'pregnancy') return s.id === 'pregnancy-scan';
    if (activeTab === 'pathology') return s.id === 'blood-test' || s.id === 'health-checkups' || s.id === 'specialist-diagnostics';
    return true;
  });

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-blue-600 font-extrabold text-xs tracking-wider uppercase font-sans px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            {t('services_badge')}
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
            {t('services_title')}
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-slate-500 mt-4 text-sm sm:text-base leading-relaxed">
            {t('services_descr')}
          </p>
        </div>

        {/* Tab Filters for fast loading & better usability */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('services_all')}
          </button>
          <button
            onClick={() => setActiveTab('scans')}
            className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              activeTab === 'scans'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('services_scans')}
          </button>
          <button
            onClick={() => setActiveTab('pregnancy')}
            className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              activeTab === 'pregnancy'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('services_pregnancy')}
          </button>
          <button
            onClick={() => setActiveTab('pathology')}
            className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              activeTab === 'pathology'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white border-slate-250 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('services_pathology')}
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div 
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-150/70 hover:border-blue-200 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between text-left"
            >
              <div>
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <ServiceIcon name={service.iconName} className="h-5.5 w-5.5" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
                    {service.category}
                  </span>
                </div>

                {/* Service Details */}
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-905 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-550 mt-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Estimate price if exists */}
                {service.priceEstimate && (
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-blue-700 bg-blue-50/50 w-fit px-2.5 py-1 rounded-lg">
                    <Sparkles className="h-3 w-3 shrink-0" />
                    <span className="font-extrabold">{service.priceEstimate}</span>
                  </div>
                )}
              </div>

              {/* Card Footer action links */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  className="inline-flex items-center gap-1 text-[11px] text-blue-605 hover:text-blue-800 font-extrabold transition-all"
                  onClick={(e) => handleInfoClick(service, e)}
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>{language === 'hi' ? "तैयारी गाइड" : "Prep Guide"}</span>
                </button>

                <div className="flex items-center text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-all">
                  <span className="mr-1 group-hover:mr-2.5 transition-all">{language === 'hi' ? "समय लें" : "Select Scan"}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Dynamic Service Patient Info & Preparation Modal */}
        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
              
              {/* Modal Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
              />

              {/* Modal Container */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.35 }}
                className="relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl z-10 border border-slate-100 flex flex-col"
              >
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 sm:p-6 relative text-left">
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 text-white p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg shrink-0">
                      <ServiceIcon name={selectedService.iconName} className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                        {selectedService.category}
                      </span>
                      <h3 className="font-display font-bold text-lg sm:text-xl mt-1 leading-normal text-white">
                        {selectedService.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 overflow-y-auto max-h-[55vh] space-y-6 text-left">
                  
                  {/* Comprehensive overview */}
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-xs tracking-wider uppercase">
                      {language === 'hi' ? "क्लीनिकल विवरण" : "Clinical Description"}
                    </h4>
                    <p className="font-sans text-slate-600 text-xs sm:text-sm leading-relaxed mt-2">
                      {selectedService.detailedDescription}
                    </p>
                  </div>

                  {/* Estimation & Duration pill */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-500 font-sans uppercase font-bold">{language === 'hi' ? "अनुमानित दर" : "Price Benchmark"}</div>
                      <div className="font-display font-extrabold text-blue-600 text-base mt-1">{selectedService.priceEstimate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-sans uppercase font-bold">{language === 'hi' ? "औसत समय" : "Typical Scan Duration"}</div>
                      <div className="font-display font-bold text-slate-800 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                        <span>{selectedService.durationMinutes} {language === 'hi' ? "मिनट" : "Mins"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Critical Patient Preparations Guidelines */}
                  <div>
                    <div className="flex items-center gap-2 text-rose-700 bg-rose-50/70 p-2 rounded-lg border border-rose-100 mb-3">
                      <Info className="h-4.5 w-4.5 shrink-0" />
                      <h4 className="font-display font-bold text-[10px] uppercase tracking-wider">
                        {t('services_prep_label')}
                      </h4>
                    </div>
                    <ul className="space-y-2.5">
                      {selectedService.preparationTips.map((tip, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs sm:text-sm">
                          <span className="bg-blue-50 text-blue-600 font-mono font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-sans text-slate-600 leading-normal">
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Footer action */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-3 shadow-inner">
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-xs font-bold bg-white transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? "बंद करें" : "Close Guide"}
                  </button>
                  <button 
                    onClick={() => {
                      onBookService(selectedService.title);
                      setSelectedService(null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold text-center shadow-md transition-all cursor-pointer"
                  >
                    {language === 'hi' ? "यह जाँच बुक करें" : "Select & Book Now"}
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
