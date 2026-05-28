import { Award, Target, FlaskConical, UserCheck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function About() {
  const { t, language } = useLanguage();

  const values = [
    {
      icon: <Award className="h-6 w-6 text-blue-600 shrink-0" />,
      title: language === 'hi' ? "वरिष्ठ रेडियोलॉजिस्ट की विशेषज्ञता" : "Senior Radiologist Expert",
      description: language === 'hi'
        ? "डॉ. संदीप शर्मा व्यक्तिगत रूप से हर एक स्कैन की स्वयं जाँच करते हैं। हम कभी भी कनिष्ठ तकनीशियनों को रिपोर्टिंग नहीं सौंपते।"
        : "Dr. Sandeep Sharma evaluates and double-checks every single scan manually. We do not delegate reports to junior technicians."
    },
    {
      icon: <FlaskConical className="h-6 w-6 text-blue-600 shrink-0" />,
      title: language === 'hi' ? "अत्याधुनिक जाँच प्रोब्स" : "Cutting-Edge Probes",
      description: language === 'hi'
        ? "स्पष्ट शारीरिक विवरण और सटीक निदान के लिए सर्वोत्तम जापानी व अमेरिकी हाई-फ्रीक्वेंसी ट्रांसड्यूसर से लैस क्लिनिक।"
        : "Equipped with state-of-the-art high-frequency transducers that map clear anatomical details with precision."
    },
    {
      icon: <Target className="h-6 w-6 text-blue-600 shrink-0" />,
      title: language === 'hi' ? "सटीक परिणाम सदैव प्रथम" : "Clinical Accuracy First",
      description: language === 'hi'
        ? "नैतिक चिकित्सा प्रक्रियाओं और कड़े मानदंडों का पूर्णतः पालन जिससे आपके रेफरिंग डॉक्टर को मिलता है शत-प्रतिशत सटीक आकलन।"
        : "Adhering to strict medical boards and ethical procedures. Providing dependable insights for your referring doctor."
    }
  ];

  const stats = [
    { number: "18+", label: language === 'hi' ? "वर्षों का अनुभव" : "Years Experience" },
    { number: "150k+", label: language === 'hi' ? "सफल डायग्नोस्टिक्स" : "Scans Completed" },
    { number: "100%", label: language === 'hi' ? "किटाणुरहित बेड" : "Hygienic Care" },
    { number: "15", label: language === 'hi' ? "मिनट सामान्य वेटिंग" : "Mins Wait Time" }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title area */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-extrabold text-xs tracking-wider uppercase font-sans px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            {t('about_badge')}
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
            {language === 'hi' ? "हमारे डायग्नोस्टिक सेंटर के बारे में" : "About Our Diagnostic Centre"}
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-slate-500 mt-4 text-sm sm:text-base leading-relaxed">
            {language === 'hi'
              ? "गुरुग्राम, हरियाणा में मरीजों को समर्पित, विश्वसनीय और तीव्र चिकित्सा निदान सेवाएं प्रदान करने के लिए पूरी तरह संकल्पित।"
              : "Dedicated to providing patient-centric, reliable, and swift medical diagnostic services in Gurugram, Haryana."}
          </p>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Block: Narrative & Credentials */}
          <div className="space-y-6 text-left">
            <h3 className="font-display font-bold text-2xl sm:text-2xl text-slate-900 leading-tight">
              {t('about_title')}
            </h3>
            
            <p className="font-sans text-slate-600 text-sm leading-relaxed">
              {t('about_p1')}
            </p>

            <p className="font-sans text-slate-600 text-sm leading-relaxed">
              {t('about_p2')}
            </p>

            {/* Dr. Details Highlight Card */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
              <div className="bg-blue-600 text-white p-3 rounded-xl shrink-0">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-slate-900 text-sm sm:text-base">
                  {t('about_dr_name')}, {t('about_dr_degree')}
                </h4>
                <p className="text-[10px] text-blue-600 font-bold mt-0.5 tracking-wider uppercase font-sans">
                  {t('about_doctor')} & Chief Director
                </p>
                <p className="text-xs text-slate-500 mt-2 font-sans leading-relaxed">
                  {t('about_dr_bio')}
                </p>
              </div>
            </div>

            {/* Core Values grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-blue-50/40 p-4 rounded-xl text-center border border-blue-50">
                  <div className="font-display font-extrabold text-blue-600 text-xl sm:text-2xl">
                    {stat.number}
                  </div>
                  <div className="text-[9px] font-extrabold text-slate-605 mt-1 uppercase tracking-wider leading-relaxed">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Block: Values List with Modern Visual Frame */}
          <div className="space-y-6">
            <div className="relative">
              {/* Abstract decorative accent */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-md opacity-10 pointer-events-none" />
              
              <div className="relative bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-150 shadow-xs space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                  <span className="font-display font-bold text-slate-900 text-base sm:text-lg">
                    {language === 'hi' ? "हमारे क्लीनिकल स्वच्छता मानक" : "Our Operational Standards"}
                  </span>
                </div>

                <div className="space-y-6">
                  {values.map((val, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="bg-blue-50 p-2 rounded-xl shrink-0 h-11 w-11 flex items-center justify-center">
                        {val.icon}
                      </div>
                      <div className="text-left">
                        <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                          {val.title}
                        </h4>
                        <p className="font-sans text-xs text-slate-500 mt-1 leading-relaxed">
                          {val.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Patient Safety Notice banner */}
                <div className="bg-yellow-50/75 p-4 rounded-xl border border-yellow-250">
                  <p className="text-xs text-yellow-805 font-sans text-left leading-relaxed">
                    <strong>{language === 'hi' ? "स्वच्छता गाइडलाइन:" : "Hygienic Guidelines:"}</strong> {language === 'hi'
                      ? "प्रत्येक मरीज के लिए नई पेपर शीट बिछाई जाती है। जाँच कक्ष पूरी तरह एसी युक्त है और प्रत्येक स्कैन के उपरांत प्रोब को कीटाणुनाशक स्पिरिट से अच्छी तरह साफ किया जाता है।"
                      : "Clean bed sheets are rolled out for every single patient. Examination rooms are consistently air-conditioned and cleaned inside-out with hospital-safety disinfectants."}
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
