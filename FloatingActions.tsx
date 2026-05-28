import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { CLINIC_INFO } from '../data';

interface FloatingActionsProps {
  onBookClick: () => void;
}

export default function FloatingActions({ onBookClick }: FloatingActionsProps) {
  const cleanPhone = CLINIC_INFO.phone.replace(/\s+/g, '');
  const cleanWhatsapp = CLINIC_INFO.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=Hi,%20I'd%20like%20to%20book%20a%20priority%20scan%20appointment%20at%20Bharat%20Diagnostic%20Centre`;

  return (
    <>
      {/* DESKTOP VIEWPORT: Floating Round Buttons (Bottom Right Corner) */}
      <div className="hidden md:flex flex-col gap-3.5 fixed bottom-6 right-6 z-40">
        
        {/* General Call Floating Action */}
        <a 
          href={`tel:${cleanPhone}`}
          className="flex items-center justify-center h-13 w-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-blue-600/30 transition-all transform hover:-translate-y-1 group"
          title="Call Clinic Coordinator"
        >
          <Phone className="h-5.5 w-5.5 group-hover:rotate-12 transition-transform" />
        </a>

        {/* WhatsApp Floating Action */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center h-13 w-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-1 group"
          title="Direct WhatsApp Reservation"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </a>

        {/* Calendar Quick Appointment Link */}
        <button
          onClick={onBookClick}
          className="flex items-center justify-center h-13 w-13 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl transition-all transform hover:-translate-y-1 group"
          title="Go to Booking Form"
        >
          <Calendar className="h-5.5 w-5.5" />
        </button>

      </div>

      {/* MOBILE VIEWPORT: Pinned Bottom Touch Navigation Bar (Accessible touch points) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] px-4 py-3 grid grid-cols-3 gap-2.5">
        
        <a
          href={`tel:${cleanPhone}`}
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider"
        >
          <Phone className="h-4.5 w-4.5" />
          <span>Call Centre</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider"
        >
          <MessageCircle className="h-4.5 w-4.5" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={onBookClick}
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-sans text-[10px] font-bold uppercase tracking-wider"
        >
          <Calendar className="h-4.5 w-4.5" />
          <span>Book Scan</span>
        </button>

      </div>
    </>
  );
}
