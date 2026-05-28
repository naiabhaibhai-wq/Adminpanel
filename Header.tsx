import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, MessageCircle, Activity, Lock, Globe, Type } from 'lucide-react';
import { CLINIC_INFO } from '../data';
import { useLanguage } from '../LanguageContext';

interface HeaderProps {
  onBookClick: () => void;
  onAdminClick: () => void;
  isAdminOpen?: boolean;
}

export default function Header({ onBookClick, onAdminClick, isAdminOpen = false }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, fontSizeScale, toggleFontSizeScale, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav_about'), href: "#about" },
    { name: t('nav_services'), href: "#services" },
    { name: t('nav_convenience'), href: "#convenience" },
    { name: t('nav_why_us'), href: "#why-us" },
    { name: t('nav_reviews'), href: "#reviews" },
    { name: t('nav_contact'), href: "#contact" },
  ];

  // Secret trigger: long press the logo for 3 seconds to open admin login
  const [longPressActive, setLongPressActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const pressTimerRef = React.useRef<any>(null);

  const startPress = (e: React.PointerEvent) => {
    // If admin is already open, do not trigger again
    if (isAdminOpen) return;
    // Avoid right clicks
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    // Clear any existing timer just in case
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    
    setLongPressActive(true);
    pressTimerRef.current = setTimeout(() => {
      onAdminClick();
      setToastMessage("Staff Access Opened");
      setLongPressActive(false);
      // Create a haptic/audio feedback where supported
      if ('vibrate' in navigator) {
        try { navigator.vibrate(80); } catch (_) {}
      }
    }, 3000); // exactly 3 seconds
  };

  const endPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setLongPressActive(false);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80; // height of sticking navbar
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header 
      id="main-nav-bar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav shadow-md py-3 text-slate-800' 
          : 'bg-white/90 backdrop-blur-sm py-4 text-slate-800 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand area (with secret 3-second long press trigger) */}
          <div 
            onPointerDown={startPress}
            onPointerUp={endPress}
            onPointerLeave={endPress}
            onPointerCancel={endPress}
            onContextMenu={(e) => {
              // Prevent context menus on mobile devices during administrative hold
              e.preventDefault();
            }}
            className={`flex items-center gap-2.5 group cursor-pointer select-none transition-all duration-300 ${
              longPressActive ? 'scale-95 opacity-80' : ''
            }`}
          >
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md group-hover:bg-blue-700 transition-colors">
              <Activity className="h-6 w-6" id="brand-logo-icon" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base sm:text-lg md:text-xl tracking-tight text-slate-900 leading-tight">
                BHARAT
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-blue-600 uppercase">
                Ultrasound & Diagnostics
              </span>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Call to Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Accessibility Font Size Toggle */}
            <button
              onClick={toggleFontSizeScale}
              title={t('fontSizeToggle')}
              className="flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              id="accessibility-font-toggle-desktop"
            >
              <Type className="h-4.5 w-4.5 shrink-0" />
              <span className="text-[9px] font-extrabold ml-0.5">{fontSizeScale === 'large' ? '-' : '+'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={t('nav_switch_lang')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-150 bg-blue-50/40 hover:bg-blue-50 text-blue-700 font-bold text-xs transition-all cursor-pointer"
              id="language-toggle-desktop"
            >
              <Globe className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>{t('nav_lang')}</span>
            </button>

            <a 
              href={`tel:${CLINIC_INFO.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:text-blue-600 font-medium text-sm transition-colors"
            >
              <Phone className="h-4 w-4 text-blue-600" />
              <span>{CLINIC_INFO.phone}</span>
            </a>
            
            <button
              onClick={onBookClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4.5 py-2.5 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              {t('nav_appointment')}
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={onBookClick}
              className="sm:hidden bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {language === 'hi' ? "बुक" : "Book"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 mr-1 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-slate-100 bg-white shadow-inner overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {/* Mobile Lang and FontSize controls */}
              <div className="grid grid-cols-2 gap-2 pb-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-blue-150 bg-blue-50/50 text-blue-700 font-bold text-xs cursor-pointer"
                >
                  <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>{t('nav_lang')}</span>
                </button>
                <button
                  onClick={toggleFontSizeScale}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  <Type className="h-4 w-4 shrink-0" />
                  <span>{t('fontSizeToggle')}: {fontSizeScale === 'large' ? "Normal" : "Large"}</span>
                </button>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <a
                  href={`tel:${CLINIC_INFO.phone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm"
                >
                  <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                  {language === 'hi' ? 'कॉल करें: ' : 'Call Support: '}{CLINIC_INFO.phone}
                </a>
                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I would like to book an appointment at Bharat Ultrasound & Diagnostic Centre`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  {t('hero_book_whatsapp')}
                </a>
                 <button
                  onClick={() => {
                    setIsOpen(false);
                    onBookClick();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md text-center text-sm cursor-pointer"
                >
                  {t('nav_appointment')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Temporary Toast message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-24 left-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700/60"
            id="toast-staff-access-indicator"
          >
            <Lock className="h-3 w-3 text-blue-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
