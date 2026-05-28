import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Convenience from './components/Convenience';
import WhyChooseUs from './components/WhyChooseUs';
import AppointmentForm from './components/AppointmentForm';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import AdminPortal from './components/AdminPortal';

export default function App() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Clear previous admin sessions on initial mount of the application/website
  useEffect(() => {
    sessionStorage.removeItem("bharat_admin_authorized");
    sessionStorage.removeItem("bharat_admin_last_activity");
    localStorage.removeItem("bharat_admin_authorized");
    localStorage.removeItem("bharat_admin_last_activity");
  }, []);

  // Dynamic SEO indices blocker for Admin context
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    if (isAdminOpen) {
      meta.setAttribute('content', 'noindex, nofollow, noarchive');
    } else {
      meta.setAttribute('content', 'index, follow');
    }
  }, [isAdminOpen]);

  const scrollSection = (id: string) => {
    const target = document.querySelector(id);
    if (target) {
      const offset = 80; // height of navbar
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleBookClick = () => {
    scrollSection('#appointment');
  };

  const handleBookService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    scrollSection('#appointment');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 pb-16 md:pb-0">
      
      {/* Sticky Header Navs block */}
      <Header onBookClick={handleBookClick} onAdminClick={() => setIsAdminOpen(true)} isAdminOpen={isAdminOpen} />

      {/* Main Page Layout Segment Columns */}
      <main className="flex flex-col">
        
        {/* Section 1: Hero */}
        <Hero onBookClick={handleBookClick} />

        {/* Section 2: About clinical context */}
        <About />

        {/* Section 3: Diagnostic scanning specials */}
        <Services onBookService={handleBookService} />

        {/* Section 4: Patient convenience waiting solution guides */}
        <Convenience />

        {/* Section 5: Why choose us certifications */}
        <WhyChooseUs />

        {/* Section 6: Dynamic appointments module */}
        <AppointmentForm initialService={selectedService} />

        {/* Section 7: Verified local feedback reviews */}
        <Reviews />

        {/* Section 8: Google maps coordinates */}
        <Contact />

      </main>

      {/* Section 9: Page Footing */}
      <Footer onAdminClick={() => setIsAdminOpen(true)} />

      {/* Floating global utility support action widgets */}
      <FloatingActions onBookClick={handleBookClick} />

      {/* Clinic Administrator Management Portal Modal */}
      <AdminPortal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

    </div>
  );
}
