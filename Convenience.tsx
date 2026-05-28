import { Clock, FileText, MessageCircle, Shield, MapPin, CheckCircle, Smartphone } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const ConvenienceIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case 'Clock':
      return <Clock className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'MessageCircle':
      return <MessageCircle className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'MapPin':
      return <MapPin className={className} />;
    default:
      return <Clock className={className} />;
  }
};

export default function Convenience() {
  const { t, language } = useLanguage();

  const problemsAndSolutions = language === 'hi' ? [
    {
      problem: "अस्पतालों में 2-3 घंटे लंबी कतारों में खड़ा रहना।",
      solution: "पहले से स्लोट बुकिंग की वजह से मात्र 10 मिनट में त्वरित सोनोग्राफी।"
    },
    {
      problem: "अगले दिन प्रिंटेड रिपोर्ट लेने के लिए क्लीनिक दोबारा लौटना।",
      solution: "जाँच के 25 मिनट में अल्ट्रासाउंड व WhatsApp पर उसी दिन खून जाँच रिपोर्ट।"
    },
    {
      problem: "गाड़ी पार्क करने की समस्या और अस्पतालों की अत्यधिक भीड़भाड़।",
      solution: "सेक्टर 31 हूडा मार्केट, प्रथम तल पर आसान सीढ़ियां और खुली मुफ्त पार्किंग।"
    },
    {
      problem: "शंकाओं को पूछने के लिए कोई सीधा और आसान माध्यम का न होना।",
      solution: "सीधे व्हाट्सएप्प पर नर्स और क्लिनिक को-ऑर्डिनेटर के साथ तुरंत संवाद शंका-निवारण।"
    }
  ] : [
    {
      problem: "Long hospital waiting queues, matching up to 2-3 hours.",
      solution: "Prior slot-allocations and instant check-ins let you scan in 15 mins."
    },
    {
      problem: "Returning to collect paper reports the next day.",
      solution: "Ultrasound handovers in 30 mins; pathology sent on WhatsApp same day."
    },
    {
      problem: "Cluttered parking and hard to reach hospital corridors.",
      solution: "Convenient Sector 31 HUDA market, ground/first floor access, ample parking."
    },
    {
      problem: "Impersonal care with no update support channels.",
      solution: "Quick 1-on-1 human assistance via direct WhatsApp chats and emergency calls."
    }
  ];

  const localizedFeatures = [
    {
      title: t('conv_wait_title'),
      description: t('conv_wait_desc'),
      iconName: "Clock"
    },
    {
      title: t('conv_reports_title'),
      description: t('conv_reports_desc'),
      iconName: "FileText"
    },
    {
      title: t('conv_whatsapp_title'),
      description: t('conv_whatsapp_desc'),
      iconName: "MessageCircle"
    },
    {
      title: t('conv_elderly_title'),
      description: t('conv_elderly_desc'),
      iconName: "Shield"
    }
  ];

  return (
    <section id="convenience" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-650 font-extrabold text-xs tracking-wider uppercase font-sans px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            {t('conv_badge')}
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
            {t('conv_title')}
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-slate-500 mt-4 text-sm sm:text-base leading-relaxed">
            {t('conv_descr')}
          </p>
        </div>

        {/* Side-by-Side highlight of problems and solutions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Comparison panel: Why we are different */}
          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-100 text-left">
            <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg mb-6">
              {language === 'hi' ? "मरीजों की आम परेशानियों का क्लिनिकल इलाज" : "Overcoming Typical Diagnostic Painpoints"}
            </h3>
            <div className="space-y-6">
              {problemsAndSolutions.map((item, idx) => (
                <div key={idx} className="border-b border-slate-200/60 pb-5 last:border-0 last:pb-0">
                  <div className="flex gap-2 items-start text-xs font-semibold text-slate-400 font-sans line-through">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{item.problem}</span>
                  </div>
                  <div className="flex gap-2 items-start text-xs sm:text-sm font-bold text-slate-800 font-sans mt-2 text-blue-700">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core conveniences grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {localizedFeatures.map((feat, idx) => (
              <div 
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-150/70 hover:border-blue-150 shadow-xs hover:shadow-md transition-all text-left group"
              >
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ConvenienceIcon name={feat.iconName} className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base mt-4">
                  {feat.title}
                </h4>
                <p className="font-sans text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Step indicator footer panel */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden text-left shadow-lg">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-blue-800/10 rounded-l-full pointer-events-none" />
          <div className="relative z-10 max-w-4xl space-y-6">
            <h3 className="font-display font-extrabold text-base sm:text-xl">
              {language === 'hi' ? "30 मिनट के भीतर रिपोर्ट पाना चाहते हैं?" : "Want your diagnostic reports within 30 minutes?"}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              {language === 'hi' 
                ? "अभी ऑनलाइन समय आरक्षित करें। हम आपके आने से पहले आपकी फाइलें तैयार रखेंगे, जिससे क्लीनिक पहुँचने पर आपका रजिस्ट्रेशन समय घटकर बिल्कुल शून्य हो जाएगा।"
                : "Book a fixed-slot online. We will prepare your folder and diagnostic files in advance, minimizing any pre-scan registration delay when you step into the center."}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="#appointment"
                className="bg-white text-blue-900 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-md"
              >
                {language === 'hi' ? "शीघ्र समय बुक करें" : "Schedule Quick Scan Slot"}
              </a>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Smartphone className="h-4 w-4 shrink-0 animate-bounce" />
                <span>{language === 'hi' ? "पूरी पैथोलॉजी रिपोर्ट सीधे आपके WhatsApp पर" : "Pathology reports delivered straight to WhatsApp"}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
