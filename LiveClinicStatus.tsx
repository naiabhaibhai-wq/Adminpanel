import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Clock, Phone, AlertCircle } from 'lucide-react';
import { CLINIC_INFO } from '../data';

export default function LiveClinicStatus() {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<{
    isOpen: boolean;
    text: string;
    subText: string;
    colorClass: string;
  }>({
    isOpen: false,
    text: "",
    subText: "",
    colorClass: "bg-slate-100 text-slate-800"
  });

  useEffect(() => {
    const calculateStatus = () => {
      // Calculate current Indian Standard Time (IST) directly to prevent timezone mismatch
      const utcDate = new Date();
      const utcTime = utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000);
      const istDate = new Date(utcTime + (3600000 * 5.5));

      const day = istDate.getDay(); // 0: Sunday, 1-6: Mon-Sat
      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const timeVal = hours * 100 + minutes; // e.g. 1430 for 2:30 PM

      let isOpen = false;
      let text = "";
      let subText = "";
      let colorClass = "";

      if (day === 0) {
        // Sunday: 9:00 AM to 2:00 PM
        if (timeVal >= 900 && timeVal < 1400) {
          isOpen = true;
          text = language === 'hi' ? "क्लीनिक अभी खुला है" : "Clinic Open Now";
          subText = language === 'hi' ? "रविवार समय: दोपहर 2:00 बजे तक" : "Sunday hours: Closes at 2:00 PM";
          colorClass = "bg-emerald-50 text-emerald-850 border-emerald-250 border-solid border";
        } else {
          isOpen = false;
          text = language === 'hi' ? "क्लीनिक अभी बंद है" : "Clinic Closed Now";
          subText = language === 'hi' ? "सोमवार सुबह 8:00 बजे खुलेगा" : "Opens Monday at 8:00 AM";
          colorClass = "bg-rose-50 text-rose-850 border-rose-150 border-solid border";
        }
      } else {
        // Mon-Sat: 8:00 AM to 8:00 PM
        if (timeVal >= 800 && timeVal < 2000) {
          isOpen = true;
          text = language === 'hi' ? "क्लीनिक अभी खुला है" : "Clinic Open Now";
          subText = language === 'hi' ? "आज रात 8:00 बजे तक खुला है" : "Closes today at 8:00 PM";
          colorClass = "bg-emerald-50 text-emerald-850 border-emerald-250 border-solid border";
        } else {
          isOpen = false;
          text = language === 'hi' ? "क्लीनिक अभी बंद है" : "Clinic Closed Now";
          const nextOpenHour = "8:00 AM";
          subText = language === 'hi' ? "कल सुबह 8:00 बजे दोबारा खुलेगा" : `Reopens tomorrow at ${nextOpenHour}`;
          colorClass = "bg-rose-50 text-rose-150 border-rose-150 border-solid border";
        }
      }

      setStatus({ isOpen, text, subText, colorClass });
    };

    calculateStatus();
    // Refresh every minute
    const interval = setInterval(calculateStatus, 30000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <div className={`p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${status.colorClass}`}>
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.isOpen ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.isOpen ? 'bg-emerald-500' : 'bg-rose-550'}`}></span>
        </span>
        <div className="text-left">
          <div className="text-sm font-extrabold flex items-center gap-1">
            <span>{status.text}</span>
          </div>
          <p className="text-[11px] sm:text-xs font-medium opacity-90 mt-0.5">{status.subText}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <span className="text-[10px] hidden md:inline-block bg-white/70 px-2 py-0.5 rounded-md font-bold tracking-tight uppercase">
          {t('status_prior_booking')}
        </span>
        <a
          href={`tel:${CLINIC_INFO.phone.replace(/\s+/g, '')}`}
          className="w-full sm:w-auto text-xs font-bold py-1.5 px-3 rounded-lg bg-white/90 hover:bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span>{CLINIC_INFO.phone}</span>
        </a>
      </div>
    </div>
  );
}
