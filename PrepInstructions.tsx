import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { ClipboardCheck, Search, Printer, Copy, Check, FileText, Compass, Info } from 'lucide-react';

export default function PrepInstructions() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Categorized instructions
  const categories = [
    {
      id: "usg",
      badge: language === 'hi' ? "पेट का स्कैन" : "Abdomen Scan",
      title: t('serv_usg_title'),
      tips: [
        language === 'hi'
          ? "जाँच से कम से कम 6 से 8 घंटे पहले पूर्ण उपवास (खाली पेट) आवश्यक है।"
          : "Fasting for at least 6-8 hours prior to the scan is strictly mandatory.",
        language === 'hi'
          ? "खाली पेट रहने के दौरान दूध, चाय, कॉफी या धूम्रपान का सेवन बिल्कुल न करें।"
          : "Avoid milk, tea, coffee, sodas, and smoking during the fasting window.",
        language === 'hi'
          ? "पानी पिया जा सकता है। हाइड्रेटेड रहें जिससे डॉक्टर को पेट के अंगों को देखने में आसानी हो।"
          : "Drinking plain water is highly allowed and recommended to keep organs hydrated."
      ]
    },
    {
      id: "pelvic",
      badge: language === 'hi' ? "पेल्विक / किडनी" : "Pelvis / KUB",
      title: language === 'hi' ? "पेल्विक और यूरिनरी ट्रैक स्कैन" : "Pelvis & Urinary Bladder Scans",
      tips: [
        language === 'hi'
          ? "इसके लिए पेशाब का तेज़ दबाव (Full Bladder) होना अत्यंत आवश्यक है।"
          : "A fully distended urinary bladder is absolutely necessary for clear visualization.",
        language === 'hi'
          ? "जाँच से 1 घंटा पहले 4-5 गिलास पानी पीएं और जाँच होने तक पेशाब न करें।"
          : "Drink 4-5 glasses of plain water 1 hour before the scan and do NOT urinate.",
        language === 'hi'
          ? "यदि दबाव नहीं बन पाता है, तो कृपया हमारे नर्स को सूचित करें ताकि वे सहायता कर सकें।"
          : "If you cannot hold or have severe discomfort, alert our coordinator at once."
      ]
    },
    {
      id: "pregnancy",
      badge: language === 'hi' ? "गर्भावस्था" : "Pregnancy",
      title: t('serv_preg_title'),
      tips: [
        language === 'hi'
          ? "ढीले और आरामदायक दो-पीस सूती कपड़े पहनें (कुर्ता-सलवार या शर्ट-पेंट)।"
          : "Wear comfortable, loose-fitting two-piece clothing for easy scanning access.",
        language === 'hi'
          ? "शुरुआती तीन महीनों के गर्भावस्था स्कैन के लिए पेशाब का हल्का दबाव आवश्यक रहता है।"
          : "Early pregnancy scans (1st Trimester) require a full bladder; drink 3 glasses of water.",
        language === 'hi'
          ? "अपने सभी पुराने अल्ट्रासाउंड और डॉक्टर के नुस्खे (Prescriptions) साथ लाना न भूलें।"
          : "Mandatory: Bring Doctor's Prescription, earlier ultrasound files, and Govt ID Card."
      ]
    },
    {
      id: "pathology",
      badge: language === 'hi' ? "खून की जांचें" : "Blood Test",
      title: t('serv_blood_title'),
      tips: [
        language === 'hi'
          ? "ब्लड शुगर (Fasting) और कोलेस्ट्रॉल (Lipid Profile) के लिए 10-12 घंटे का उपवास अनिवार्य है।"
          : "For Glucose Fasting and Lipid profile, 10-12 hours of strict overnight fasting is required.",
        language === 'hi'
          ? "सुबह उठकर अपनी बीपी की आवश्यक दवा पानी के छोटे घूंट के साथ ले सकते हैं।"
          : "Take vital chronic heart/blood pressure tablets as usual with a mild sip of water.",
        language === 'hi'
          ? "लैब में नमूना देने से पहले अत्यधिक मीठे पेय पदार्थों या चाय का सेवन बंद रखें।"
          : "Avoid sugary fruit juices or tea immediately before giving your blood sample."
      ]
    }
  ];

  // Filter based on search
  const filteredCategories = categories.filter(cat => {
    const searchString = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(searchString) ||
      cat.badge.toLowerCase().includes(searchString) ||
      cat.tips.some(tip => tip.toLowerCase().includes(searchString))
    );
  });

  const handleCopy = () => {
    // Generate text of instructions
    const textToCopy = categories.map(cat => {
      return `--- ${cat.title} ---\n` + cat.tips.map((tip, i) => `${i+1}. ${tip}`).join('\n');
    }).join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="preparation" className="py-20 bg-slate-55 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 font-extrabold text-xs tracking-wider uppercase font-sans px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            {t('prep_badge')}
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
            {t('prep_title')}
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-slate-500 mt-4 text-sm sm:text-base">
            {t('prep_subtitle')}
          </p>
        </div>

        {/* Search & Actions Bar */}
        <div className="max-w-xl mx-auto mb-10 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('prep_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-slate-800 border border-slate-200 outline-hidden bg-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
            />
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              title={t('prep_copy_btn')}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
              <span>{copied ? t('prep_copied') : language === 'hi' ? "कॉपी करें" : "Copy"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              title={t('prep_print_btn')}
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>{language === 'hi' ? "प्रिंट" : "Print"}</span>
            </button>
          </div>
        </div>

        {/* Quick Helper Tips Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-100 text-left hover:shadow-md transition-shadow">
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl w-fit mb-3.5">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <h4 className="font-display font-bold text-slate-900 text-sm">{t('prep_fasting_title')}</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t('prep_fasting_text')}</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-100 text-left hover:shadow-md transition-shadow">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl w-fit mb-3.5">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="font-display font-bold text-slate-900 text-sm">{t('prep_bladder_title')}</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t('prep_bladder_text')}</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-100 text-left hover:shadow-md transition-shadow">
            <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl w-fit mb-3.5">
              <Compass className="h-5 w-5" />
            </div>
            <h4 className="font-display font-bold text-slate-900 text-sm">{t('prep_docs_title')}</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t('prep_docs_text')}</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-100 text-left hover:shadow-md transition-shadow">
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl w-fit mb-3.5">
              <Info className="h-5 w-5" />
            </div>
            <h4 className="font-display font-bold text-slate-900 text-sm">{t('prep_meds_title')}</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t('prep_meds_text')}</p>
          </div>

        </div>

        {/* Detailed Guidelines Listing */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-150/60 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-slate-900 text-base sm:text-lg mb-4">
                    {cat.title}
                  </h3>
                  
                  <ul className="space-y-3">
                    {cat.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                        <span className="h-5 w-5 bg-slate-50 border text-[10px] text-slate-500 font-extrabold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 max-w-lg mx-auto">
            <Info className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 text-xs font-semibold">{t('faq_no_results')}</p>
          </div>
        )}

      </div>
    </section>
  );
}
