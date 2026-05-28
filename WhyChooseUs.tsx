import { Shield, Sparkles, Building, Award, ThumbsUp, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const getPillarIcon = (id: string, className?: string) => {
  switch (id) {
    case 'trusted':
      return <Building className={className} />;
    case 'staff':
      return <Award className={className} />;
    case 'reports':
      return <Shield className={className} />;
    case 'hygiene':
      return <Sparkles className={className} />;
    case 'quick':
      return <ThumbsUp className={className} />;
    case 'friendly':
      return <HeartHandshake className={className} />;
    default:
      return <Shield className={className} />;
  }
};

export default function WhyChooseUs() {
  const { t, language } = useLanguage();

  const localizedPillars = language === 'hi' ? [
    {
      id: "trusted",
      title: "PC-PNDT मान्यता प्राप्त क्लिनिक",
      description: "हरियाणा स्वास्थ्य विभाग द्वारा पंजीकृत व प्रमाणित नैतिक क्लिनिक जो पीसीपीएनडीटी नियमों का कड़ाई से पालन करता है।"
    },
    {
      id: "staff",
      title: "वरिष्ठ रेडियोलॉजिस्ट का व्यक्तिगत समय",
      description: "सभी जाँचे 18+ वर्षों से सुप्रसिद्ध रेडियोलॉजिस्ट डॉ. संदीप शर्मा द्वारा स्वयं की जाती हैं, जिससे गलती की कोई गुंजाइश नहीं बचती।"
    },
    {
      id: "reports",
      title: "शत-प्रतिशत सटीक परिणाम",
      description: "अत्याधुनिक अमेरिकी प्रणालियाँ उपलब्ध हैं जो आपके रेफरिंग डॉक्टर को आपकी बीमारी का सटीक उपचार करने में मदद करती हैं।"
    },
    {
      id: "hygiene",
      title: "गहन क्लिनिकल स्वच्छता",
      description: "हम प्रत्येक मरीज की सोनोग्राफी के तुरंत बाद अल्ट्रासाउंड प्रोब और लेटने के बेड को मेडिकल स्प्रे से स्वच्छ व कीटाणुमुक्त करते हैं।"
    },
    {
      id: "quick",
      title: "उसी दिन सभी परिणाम उपलब्ध",
      description: "एक ही छत के नीचे अल्ट्रासाउंड के साथ बायोकेमेस्ट्री और थायराइड खून की जांच भी पूर्ण रूप से उपलब्ध हैं।"
    },
    {
      id: "friendly",
      title: "अत्यंत विनम्र नर्सिंग स्टाफ",
      description: "हमारी समर्पित महिला कोऑर्डिनेटर महिला मरीजों और बुजुर्गों की निजता, भरपूर आराम और सहायता का सर्वदा ख़याल रखती हैं।"
    }
  ] : [
    {
      id: "trusted",
      title: t('why_trusted_title'),
      description: t('why_trusted_desc')
    },
    {
      id: "staff",
      title: t('why_doctor_title'),
      description: t('why_doctor_desc')
    },
    {
      id: "reports",
      title: t('why_accuracy_title'),
      description: t('why_accuracy_desc')
    },
    {
      id: "hygiene",
      title: t('why_sterilized_title'),
      description: t('why_sterilized_desc')
    },
    {
      id: "quick",
      title: "Same Day Diagnostic Results",
      description: "Integrated in-house diagnostics and pathology systems mean your combined blood and scan analysis reports are ready concurrently."
    },
    {
      id: "friendly",
      title: "Patient-First Respect & Care",
      description: "Our female nurses and support staff ensure exceptional privacy, high dignity, and comfort for expecting mothers and elderly patients."
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-extrabold text-xs tracking-wider uppercase font-sans px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            {language === 'hi' ? "उत्कृष्टता के मानक" : "Our Quality Benchmarks"}
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-905 tracking-tight mt-3">
            {t('why_title')}
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-slate-500 mt-4 text-sm sm:text-base leading-relaxed">
            {language === 'hi'
              ? "क्लीनिकल उत्कृष्टता के लिए पूरी ईमानदारी और जिम्मेदारी महत्वपूर्ण है। हमारे क्लिनिक पर मरीजों का ख्याल सर्वोपरि है।"
              : "Clinical excellence requires clean workflows and expert execution. At Bharat Ultrasound, every detail counts."}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {localizedPillars.map((pillar) => (
            <div 
              key={pillar.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-150/70 hover:border-blue-200 hover:shadow-lg transition-all group text-left"
            >
              {/* Pillar Icon Box */}
              <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                {getPillarIcon(pillar.id, "h-5.5 w-5.5")}
              </div>

              {/* Title & Description */}
              <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg mt-5">
                {pillar.title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust badge stamp highlight */}
        <div className="mt-16 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl shrink-0 font-display font-extrabold text-xs sm:text-sm text-center border border-emerald-150 tracking-tight uppercase">
            {language === 'hi' ? "PC-PNDT स्वीकृत" : "PC-PNDT Approved"}
          </div>
          <div>
            <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base">
              {language === 'hi' ? "सरकारी कानूनों का शत-प्रतिशत सम्मान" : "Strict Adherence to Diagnostic Regulatory Ethics"}
            </h4>
            <p className="font-sans text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
              {language === 'hi'
                ? "हम सिविल सर्जन कार्यालय, गुरुग्राम द्वारा जारी लाइसेंस पंजीकरण के तहत काम करते हैं। हम कानूनी तौर पर प्रतिज्ञा लेते हैं कि पेट में पल रहे शिशु के लिंग की जाँच क्लीनिक पर कभी नहीं की जाती। हम स्वास्थ्य मानकों का पूर्ण सम्मान करते हैं।"
                : "We operate strictly under license ID registrations governed by the Civil Surgeon Office, Gurugram. We maintain absolute digital filing logs for every scan, protecting clinical standards set by Indian health authorities."}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
