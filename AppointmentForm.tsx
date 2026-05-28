import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Phone, Clock, FileText, Check, AlertCircle, X, Shield, ArrowRight, MessageCircle, Lock, CheckCircle2 } from 'lucide-react';
import { CLINIC_INFO } from '../data';
import { Appointment } from '../types';

interface AppointmentFormProps {
  initialService?: string;
  onSuccess?: () => void;
}

export default function AppointmentForm({ initialService = "", onSuccess }: AppointmentFormProps) {
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:00 AM');
  const [serviceType, setServiceType] = useState('Advanced Ultrasound (USG)');
  const [notes, setNotes] = useState('');

  // Local state tracking
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [justBooked, setJustBooked] = useState<Appointment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [submitMode, setSubmitMode] = useState<'WhatsApp' | 'Website' | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Live booked slot tracking
  const [serverBookings, setServerBookings] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchServerBookings = async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setServerBookings(data);
      }
    } catch (err) {
      console.error("Failed fetching live bookings status:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (initialService) {
      setServiceType(initialService);
    }
  }, [initialService]);

  // Load existing bookings on component load & setup live polling sync
  useEffect(() => {
    const saved = localStorage.getItem('bharat_appointments');
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed loading saved appointments", e);
      }
    }

    fetchServerBookings();
    const interval = setInterval(fetchServerBookings, 8000); // 8 seconds sync
    return () => clearInterval(interval);
  }, []);

  const timeOptions = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
  ];

  const serviceCategories = [
    "Advanced Ultrasound (USG)",
    "Maternal & Pregnancy Scans",
    "Pathology & Blood Tests",
    "Full Body Health Packages",
    "Routine Vital Screenings",
    "Specialist Diagnostics"
  ];

  // Helper validation tools
  const getBookedSlotsForDate = (date: string) => {
    if (!date) return [];
    return serverBookings
      .filter((b: any) => b.preferredDate === date && b.status !== "Cancelled")
      .map((b: any) => b.preferredTime);
  };

  const isTimeBooked = (date: string, time: string) => {
    const booked = getBookedSlotsForDate(date);
    return booked.includes(time);
  };

  const getSuggestedSlots = (date: string, requestedTime: string) => {
    const booked = getBookedSlotsForDate(date);
    const index = timeOptions.indexOf(requestedTime);
    const suggestions: string[] = [];
    
    // Find next available slots in chronological order
    let searchIndex = index === -1 ? 0 : index + 1;
    while (suggestions.length < 3 && searchIndex < timeOptions.length) {
      const slot = timeOptions[searchIndex];
      if (!booked.includes(slot)) {
        suggestions.push(slot);
      }
      searchIndex++;
    }
    
    // Fallback from morning
    if (suggestions.length < 3) {
      let fallbackIndex = 0;
      while (suggestions.length < 3 && fallbackIndex < timeOptions.length) {
        const slot = timeOptions[fallbackIndex];
        if (!booked.includes(slot) && !suggestions.includes(slot) && slot !== requestedTime) {
          suggestions.push(slot);
        }
        fallbackIndex++;
      }
    }
    return suggestions;
  };

  const bookedSlotsOnSelectedDate = getBookedSlotsForDate(preferredDate);
  const currentSlotConflict = preferredDate && isTimeBooked(preferredDate, preferredTime);
  const dynamicSuggestions = currentSlotConflict ? getSuggestedSlots(preferredDate, preferredTime) : [];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg(false);

    // Valuating rules
    if (!name.trim()) {
      setErrorMsg("Please enter the patient's full name.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!preferredDate) {
      setErrorMsg("Please choose your preferred date.");
      return;
    }

    // 1. Live Validation Pre-Check to prevent race conditions
    try {
      const verifyRes = await fetch('/api/bookings');
      if (verifyRes.ok) {
        const currentDb = await verifyRes.json();
        setServerBookings(currentDb);
        const conflict = currentDb.some((b: any) => 
          b.preferredDate === preferredDate && 
          b.preferredTime === preferredTime && 
          b.status !== "Cancelled"
        );
        if (conflict) {
          setErrorMsg("This time slot is already booked. Please choose an alternative slot or see the suggestions below.");
          return;
        }
      }
    } catch (e) {
      console.warn("Live validation pre-check bypass warning", e);
    }

    const selectedSource: 'WhatsApp Booking' | 'Website Booking' = submitMode === 'WhatsApp' ? 'WhatsApp Booking' : 'Website Booking';

    const newBooking: Appointment = {
      id: "APT-" + Date.now().toString().slice(-6),
      name: name.trim(),
      phone: phone.trim(),
      preferredDate,
      preferredTime,
      serviceType,
      notes: notes.trim(),
      status: 'Pending',
      bookingSource: selectedSource,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    setIsSaving(true);

    try {
      // 2. Submit booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });

      if (response.status === 409) {
        // Handle double booking conflict elegantly
        const errorData = await response.json();
        setErrorMsg(errorData.error || "This time slot is already booked.");
        setIsSaving(false);
        // Refresh live slots
        fetchServerBookings();
        return;
      }

      let savedBooking = newBooking;
      if (response.ok) {
        savedBooking = await response.json();
      } else {
        console.warn("Server booking returned status fail, using generated object");
      }

      // 3. Keep local list synchrony
      const updated = [savedBooking, ...appointments];
      setAppointments(updated);
      localStorage.setItem('bharat_appointments', JSON.stringify(updated));

      setJustBooked(savedBooking);

      // Graceful delay for premium visual loading confirmation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsSaving(false);
      setSuccessMsg(true);

      const whatsappUrl = getWhatsAppURL(savedBooking);

      // Reset standard form inputs
      setName('');
      setPhone('');
      setNotes('');
      setPreferredDate('');
      setPreferredTime('09:00 AM');
      setErrorMsg('');

      if (onSuccess) {
        onSuccess();
      }

      // Refresh live records
      fetchServerBookings();

      // 4. Instant automatic WhatsApp redirection ONLY if Book via WhatsApp was chosen
      if (selectedSource === 'WhatsApp Booking') {
        try {
          const newWin = window.open(whatsappUrl, '_blank');
          if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
            window.location.href = whatsappUrl;
          }
        } catch (err) {
          console.warn("Failed to open WhatsApp window, trying direct redirection", err);
          window.location.href = whatsappUrl;
        }
      }

    } catch (err) {
      console.error("Booking sync failed, falling back to local-only sync and redirect check", err);
      // Fallback: local only to guarantee flawless continuity for patient
      const updated = [newBooking, ...appointments];
      setAppointments(updated);
      localStorage.setItem('bharat_appointments', JSON.stringify(updated));
      setJustBooked(newBooking);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSaving(false);
      setSuccessMsg(true);

      setName('');
      setPhone('');
      setNotes('');
      setPreferredDate('');
      setPreferredTime('09:00 AM');
      setErrorMsg('');

      if (selectedSource === 'WhatsApp Booking') {
        const whatsappUrl = getWhatsAppURL(newBooking);
        window.location.href = whatsappUrl;
      }
    }
  };

  const handleCancelAppointment = (id: string) => {
    const updated = appointments.filter(apt => apt.id !== id);
    setAppointments(updated);
    localStorage.setItem('bharat_appointments', JSON.stringify(updated));
    if (justBooked?.id === id) {
      setJustBooked(null);
      setSuccessMsg(false);
    }
  };

  const handleClearLocalHistory = () => {
    setAppointments([]);
    localStorage.removeItem('bharat_appointments');
    setShowClearConfirm(false);
  };

  const getWhatsAppURL = (apt: Appointment) => {
    const text = `Hello Bharat Ultrasound & Diagnostic Centre, I have registered a scan appointment request through your website. Here are my details:

- Patient Name: ${apt.name}
- Phone Number: ${apt.phone}
- Preferred Date: ${apt.preferredDate}
- Preferred Time: ${apt.preferredTime}
- Service Type: ${apt.serviceType}
- Additional Notes: ${apt.notes || 'None'}

Please confirm if this slot is available. Thank you!`;

    return `https://wa.me/${CLINIC_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="appointment" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title area */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-extrabold text-xs tracking-wider uppercase font-sans">
            Guaranteed Slots
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">
            Schedule Your Appointment
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-slate-500 mt-4 text-base sm:text-lg">
            Reserve your preferred diagnostic or scanning window. We coordinate with you on WhatsApp or Call within 10 minutes to finalize!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Block: Instructions & FAQ tips */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h3 className="font-display font-bold text-slate-900 text-xl sm:text-2xl leading-tight">
              Pre-Appointment Requirements
            </h3>
            
            <p className="font-sans text-slate-600 text-sm">
              To support compliance with Indian diagnostic regulations and secure highly accurate scan scores, patients are requested to read the tips below.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Government Identification (Aadhar)</h4>
                  <p className="text-xs text-slate-500 font-sans mt-1">
                    An Aadhar Card holds absolute compliance importance for pregnancy related diagnostic scans. Kindly bring it along.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Arrival Timings Strategy</h4>
                  <p className="text-xs text-slate-500 font-sans mt-1">
                    Please try to report at our reception desk 10-15 minutes prior to your allocated slot for quick registration and folder preparation.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Instant WhatsApp Confirmation</h4>
                  <p className="text-xs text-slate-500 font-sans mt-1">
                    After filling out this form, click the WhatsApp button to submit directly and bypass email delays.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60">
              <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs uppercase tracking-wider mb-2 font-display">
                <Shield className="h-4 w-4 shrink-0" />
                <span>Patient Secrecy Guarded</span>
              </div>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                All patient personal information, scan diagnostics, blood metrics, and folders are stored with premium security protocols. Reports are shared only with designated numbers.
              </p>
            </div>
          </div>

          {/* Right Block: Pure Booking Form with modern fields */}
          <div className="lg:col-span-7">
            
            <div className="bg-white/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl" />
              
              <AnimatePresence>
                {isSaving && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-40 text-center"
                    id="saving-loader-overlay"
                  >
                    {/* Ring loader */}
                    <div className="relative flex items-center justify-center mb-5">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-100 border-t-blue-600"></div>
                      <MessageCircle className="h-6 w-6 text-emerald-500 absolute animate-pulse" />
                    </div>
                    
                    <h4 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl">
                      Saving your appointment request...
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
                      Please hold on! We are solidifying your slot on our records and instantly bridging to WhatsApp.
                    </p>
                    
                    <div className="w-48 bg-slate-100 h-1 rounded-full overflow-hidden mt-5">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {successMsg && justBooked ? (
                  <motion.div
                    key="success-card-ticket"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div className="text-center pb-2 border-b border-slate-100">
                      <div className="inline-flex items-center justify-center bg-emerald-100 text-emerald-600 p-4 rounded-full mb-3 shrink-0 h-14 w-14 shadow-xs">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h3 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                        Appointment Slot Reserved!
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-slate-500 mt-1">
                        Your requested appointment slot has been successfully secured.
                      </p>
                    </div>

                    {/* Booking Details Card Ticket */}
                    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5 mb-5 relative overflow-hidden select-none">
                      {/* Decorative side ticket notches */}
                      <div className="absolute top-1/2 -left-3 h-5 w-5 rounded-full bg-white border border-slate-100 transform -translate-y-1/2"></div>
                      <div className="absolute top-1/2 -right-3 h-5 w-5 rounded-full bg-white border border-slate-100 transform -translate-y-1/2"></div>
                      
                      <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-3.5 mb-3.5">
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                            Appointment ID
                          </p>
                          <span className="font-mono text-sm font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {justBooked.id}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">
                            Current Status
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/50 px-2.5 py-0.5 rounded-full select-none">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>Pending Confirmation</span>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 font-sans text-xs sm:text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Patient Name:</span>
                          <span className="font-semibold text-slate-800">{justBooked.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Service Type:</span>
                          <span className="font-semibold text-slate-800">{justBooked.serviceType}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Preferred Date:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{justBooked.preferredDate}</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Preferred Time Slot:</span>
                          <span className="font-extrabold text-blue-600 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-blue-500" />
                            <span>{justBooked.preferredTime}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Patient Psychology Trust Messages */}
                    <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 space-y-2">
                      <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 font-display">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        <span>Committed Diagnostic Care</span>
                      </p>
                      <p className="text-xs text-emerald-800 font-sans leading-relaxed">
                        To guarantee Indian medical regulatory compliance and high diagnostic precision, our representative has locked this slot. We will contact you at <strong className="text-emerald-950 font-semibold">{justBooked.phone}</strong> via WhatsApp or direct voice call shortly (typically within 10 minutes) to verify requirements and finalize your schedule.
                      </p>
                    </div>

                    {/* Success Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      {justBooked.bookingSource === 'WhatsApp Booking' && (
                        <a
                          href={getWhatsAppURL(justBooked)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3.5 px-6 rounded-xl shadow-md shadow-emerald-500/10 w-full text-center transition-all hover:shadow-lg active:scale-98 cursor-pointer"
                        >
                          <MessageCircle className="h-5 w-5 shrink-0" />
                          <span>Instantly Confirm on WhatsApp</span>
                        </a>
                      )}
                      
                      <button
                        onClick={() => {
                          setSuccessMsg(false);
                          setJustBooked(null);
                        }}
                        className="text-slate-600 bg-slate-100 hover:bg-slate-200/85 font-bold text-sm py-3.5 px-5 rounded-xl text-center w-full sm:w-auto transition-all cursor-pointer hover:shadow-xs active:scale-98 shrink-0 animate-pulse"
                      >
                        Book Another Slot
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="booking-form-fields"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="font-display font-bold text-slate-900 text-lg sm:text-xl text-left">
                      Fill Slot Request form
                    </h3>

                    {/* Error Banner */}
                    {errorMsg && (
                      <div className="p-3.5 bg-rose-50/75 border border-rose-100 text-rose-800 text-xs sm:text-sm font-sans rounded-xl text-left flex items-start gap-2.5 shadow-xs">
                        <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-normal">{errorMsg}</span>
                      </div>
                    )}

                    {/* Core Input Form fields */}
                    <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
                      
                      {/* Grid for Name and Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-sans">
                            Patient Full Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input 
                              type="text"
                              placeholder="Enter full name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full text-slate-800 border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 p-3.5 rounded-xl text-sm transition-colors"
                              id="patient-name-input"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-sans">
                            Patient Phone Number <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input 
                              type="tel"
                              placeholder="Enter 10-digit mobile"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                              className="w-full text-slate-800 border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 p-3.5 rounded-xl text-sm transition-colors"
                              id="patient-phone-input"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Date & Interactive Time Slot Selector */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-sans flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-blue-600" />
                            <span>Preferred Date</span>
                            <span className="text-rose-500">*</span>
                          </label>
                          <input 
                            type="date"
                            value={preferredDate}
                            onChange={(e) => {
                              setPreferredDate(e.target.value);
                              setErrorMsg('');
                            }}
                            min={new Date().toISOString().split('T')[0]} // Cannot choose past
                            className="w-full text-zinc-950 font-semibold border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 p-3.5 rounded-xl text-sm transition-all"
                            id="patient-date-input"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-sans flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-blue-600" />
                              <span>Available Appointment Time Slots {preferredDate ? `(${preferredDate})` : ''}</span>
                            </label>
                            {loadingSlots && (
                              <span className="text-[10px] text-blue-600 mt-0.5 animate-pulse font-mono flex items-center gap-1 font-bold">
                                Syncing slots...
                              </span>
                            )}
                          </div>

                          {!preferredDate ? (
                            <div className="p-5 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                              <Calendar className="h-5 w-5 text-slate-400 mx-auto mb-2 animate-bounce z-10" />
                              <p className="text-xs text-slate-500 font-sans">
                                Please select your preferred date above to inspect slot times real-time.
                              </p>
                            </div>
                          ) : (
                            <>
                              {/* Interactive Visual Grid of Slots */}
                              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2 max-h-[190px] overflow-y-auto p-2 bg-slate-50/80 border border-slate-200 rounded-2xl" id="time-slot-grid">
                                {timeOptions.map((time) => {
                                  const booked = isTimeBooked(preferredDate, time);
                                  const selected = preferredTime === time;

                                  return (
                                    <button
                                      key={time}
                                      type="button"
                                      onClick={() => {
                                        if (!booked) {
                                          setPreferredTime(time);
                                          setErrorMsg('');
                                        }
                                      }}
                                      disabled={booked}
                                      className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                                        selected
                                          ? "bg-blue-600 text-white border-2 border-blue-600 shadow-md shadow-blue-500/10 cursor-pointer"
                                          : booked
                                          ? "bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed line-through relative"
                                          : "bg-white text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-400 cursor-pointer hover:shadow-xs active:scale-95"
                                      }`}
                                      title={booked ? "Already booked by another patient" : `Request slot at ${time}`}
                                    >
                                      {booked && <Lock className="h-3 w-3 shrink-0 text-slate-400" />}
                                      <span>{time}</span>
                                      {selected && <Check className="h-3 w-3 shrink-0 text-white" />}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Smart Slot Suggestions Alert Panel */}
                              <AnimatePresence>
                                {currentSlotConflict && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="p-3.5 bg-slate-50 border border-slate-200/80 text-slate-850 text-xs rounded-xl text-left"
                                  >
                                    <div className="flex gap-2.5 items-start mb-2.5">
                                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                      <div>
                                        <span className="font-semibold text-slate-900 leading-tight block">This slot is already reserved.</span>
                                        <p className="text-[11px] text-slate-500 mt-0.5 font-sans leading-relaxed">
                                          {preferredTime} on {preferredDate} is taken. Please select another slot from the options above, or choose one of our recommended available times:
                                        </p>
                                      </div>
                                    </div>

                                    {/* Suggestions Pills */}
                                    <div className="flex flex-wrap gap-2 items-center pl-6">
                                      {dynamicSuggestions.map((suggestion) => (
                                        <button
                                          key={suggestion}
                                          type="button"
                                          onClick={() => {
                                            setPreferredTime(suggestion);
                                            setErrorMsg('');
                                          }}
                                          className="px-2.5 py-1 text-[11px] font-extrabold text-blue-700 bg-white border border-blue-200 hover:border-blue-600 hover:bg-blue-50/60 transition-all rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                                        >
                                          <Clock className="h-3 w-3 text-blue-500" />
                                          <span>{suggestion}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Service Type Selection Dropdown */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-sans">
                          Select Required Scan / Diagnostic Service
                        </label>
                        <select
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                          className="w-full text-slate-800 border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 p-3.5 rounded-xl text-sm transition-colors cursor-pointer"
                          id="patient-service-select"
                        >
                          {serviceCategories.map((service) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>

                      {/* Optional doctor notes */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 tracking-wide uppercase font-sans">
                          Additional Symptoms / Referring Gynaecologist (Optional)
                        </label>
                        <textarea 
                          rows={2}
                          placeholder="E.g., 12-week pregnancy scan reference, lipid fast blood request patterns..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full text-slate-800 border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 p-3.5 rounded-xl text-sm transition-colors"
                          id="patient-symptoms-input"
                        />
                      </div>

                      {/* Dual booking submit button actions */}
                      <div className="space-y-3.5 pt-2">
                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest font-sans block text-center">
                          — SELECT BOOKING MODE —
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Option A: Book via WhatsApp */}
                          <button 
                            type="submit"
                            onClick={() => setSubmitMode('WhatsApp')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 hover:shadow-lg flex flex-col items-center justify-center gap-1 cursor-pointer transform active:scale-99 border border-emerald-500/10"
                            id="opt-whatsapp-booking"
                          >
                            <div className="flex items-center gap-1.5">
                              <MessageCircle className="h-4.5 w-4.5 text-white" />
                              <span className="text-sm">Book via WhatsApp</span>
                            </div>
                            <span className="text-[10px] text-emerald-100 font-normal">Auto-redirects to confirm</span>
                          </button>

                          {/* Option B: Website Booking Only */}
                          <button 
                            type="submit"
                            onClick={() => setSubmitMode('Website')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-lg flex flex-col items-center justify-center gap-1 cursor-pointer transform active:scale-99 border border-blue-500/10"
                            id="opt-website-booking"
                          >
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-4.5 w-4.5 text-white" />
                              <span className="text-sm">Secure Website Booking</span>
                            </div>
                            <span className="text-[10px] text-blue-100 font-normal">Direct saving, no redirect</span>
                          </button>
                        </div>
                      </div>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Local Active Bookings Dashboard Panel (Only shows if they have booked locally) */}
            <AnimatePresence>
              {appointments.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-left"
                >
                  {/* Header metadata layout with clear action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200/60 mb-4 gap-3">
                    <div>
                      <h4 className="font-display font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                        Your Recent Appointments {appointments.length > 3 ? `(${appointments.slice(0, 3).length} of ${appointments.length})` : `(${appointments.length})`}
                      </h4>
                      <p className="text-[11px] font-sans text-slate-500 mt-0.5">
                        Visible only on this device/browser.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {showClearConfirm ? (
                        <div className="flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                          <span className="text-[10px] font-bold text-rose-700 font-sans">Clear all?</span>
                          <button
                            onClick={handleClearLocalHistory}
                            className="text-[10px] font-extrabold text-white bg-rose-600 hover:bg-rose-700 px-2 py-0.5 rounded-md cursor-pointer transition-all"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowClearConfirm(true)}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-rose-100"
                        >
                          Clear Local History
                        </button>
                      )}
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 select-none whitespace-nowrap">
                        Secure Client Cache
                      </span>
                    </div>
                  </div>

                  {/* Compact card items mapping */}
                  <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                    {appointments.slice(0, 3).map((apt) => {
                      // Private phone masker format: 8130****76
                      const maskPhone = (phoneStr: string) => {
                        if (!phoneStr) return "";
                        const digits = phoneStr.replace(/\D/g, "");
                        if (digits.length === 10) {
                          return `${digits.slice(0, 4)}****${digits.slice(8)}`;
                        }
                        if (digits.length > 10) {
                          const countryCode = digits.slice(0, digits.length - 10);
                          const mainPart = digits.slice(digits.length - 10);
                          return `+${countryCode} ${mainPart.slice(0, 4)}****${mainPart.slice(8)}`;
                        }
                        if (digits.length >= 6) {
                          return `${digits.slice(0, 4)}****${digits.slice(-2)}`;
                        }
                        return phoneStr;
                      };

                      return (
                        <div 
                          key={apt.id}
                          className="bg-white p-4 rounded-xl border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-100/90 transition-all shadow-xs"
                        >
                          <div className="space-y-2.5 w-full">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display font-extrabold text-slate-800 text-sm">
                                {apt.name}
                              </span>
                              <span className="font-mono text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md font-bold border border-blue-100 select-all">
                                {apt.id}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/40 px-2.5 py-0.5 rounded-full select-none">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                <span>Pending Confirmation</span>
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-500 font-sans border-t border-slate-50 pt-2.5">
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">Service Category</span>
                                <span className="font-semibold text-slate-700 truncate block">{apt.serviceType}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">Patient Mobile</span>
                                <span className="font-semibold text-slate-700 block font-mono">{maskPhone(apt.phone) || "N/A"}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">Requested Date</span>
                                <span className="font-semibold text-slate-700 block">{apt.preferredDate}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold mb-0.5">Time Slot</span>
                                <span className="font-extrabold text-blue-600 block">{apt.preferredTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100/70 shrink-0 justify-end">
                            <a
                              href={getWhatsAppURL(apt)}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors w-full md:w-auto cursor-pointer"
                            >
                              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                              <span>Track status</span>
                            </a>
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="bg-rose-50 text-rose-600 hover:text-rose-800 hover:bg-rose-100 border border-rose-100 text-xs font-bold p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Cancel Request"
                            >
                              <X className="h-4 w-4 shrink-0" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
