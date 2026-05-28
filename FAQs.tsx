import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { ChevronDown, Search, HelpCircle, MessageSquare } from 'lucide-react';
import { CLINIC_INFO } from '../data';

export default function FAQs() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQs structures with keys mapped to translations or custom localized lists
  const faqList = [
    {
      q: t('faq_q1'),
      a: t('faq_a1')
    },
    {
      q: t('faq_q2'),
      a: t('faq_a2')
    },
    {
      q: t('faq_q3'),
      a: t('faq_a3')
    },
    {
      q: t('faq_q4'),
      a: t('faq_a4')
    },
    {
      q: t('faq_q5'),
      a: t('faq_a5')
    },
    {
      q: t('faq_q6'),
      a: t('faq_a6')
    }
  ];

  // Search filter
  const filteredFaqs = faqList.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 font-extrabold text-xs tracking-wider uppercase font-sans px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            {t('faq_badge')}
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
            {t('faq_title')}
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-slate-500 mt-4 text-sm sm:text-base">
            {t('faq_descr')}
          </p>
        </div>

        {/* Search input to filter FAQs */}
        <div className="relative max-w-lg mx-auto mb-10">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('faq_search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-slate-800 border border-slate-200 outline-hidden bg-slate-50 p-3 pl-11 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Accordions list */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen 
                      ? 'border-blue-200 bg-blue-50/10 shadow-xs' 
                      : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-display font-bold text-slate-900 text-sm sm:text-base cursor-pointer focus:outline-none"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className={`h-4.5 w-4.5 shrink-0 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'transform rotate-180 text-blue-600' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm font-sans border-t border-slate-50 leading-relaxed text-left">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 border border-dashed border-slate-200 bg-slate-50 rounded-2xl text-center max-w-md mx-auto">
            <p className="text-slate-500 text-xs sm:text-sm">{t('faq_no_results')}</p>
          </div>
        )}

        {/* WhatsApp Helpline Helper Footer */}
        <div className="mt-12 p-5 bg-blue-50/30 rounded-2xl border border-blue-50 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-display font-bold text-slate-900 text-sm">{language === 'hi' ? "कोई अन्य प्रश्न है?" : "Have another query?"}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{language === 'hi' ? "हमारे नर्सिंग स्टाफ से व्हाट्सएप पर बेझिझक तुरंत बात करें।" : "Feel free to chat with our clinic coordinators on WhatsApp directly."}</p>
          </div>
          <a
            href={`https://wa.me/${CLINIC_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I have a question about tests at Bharat Diagnostic.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 cursor-pointer transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{language === 'hi' ? "व्हाट्सएप चैट शुरू करें" : "Start WhatsApp Chat"}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
