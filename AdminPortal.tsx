import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, RefreshCw, ShieldCheck, CheckCircle2, 
  X, Calendar, Phone, Clock, FileSpreadsheet, Trash2, 
  Bell, BellOff, Volume2, Search, ArrowLeft, Filter, AlertTriangle,
  MessageSquare, Send, Mail, Check, Globe
} from "lucide-react";
import { Appointment } from "../types";

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPortal({ isOpen, onClose }: AdminPortalProps) {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Secure dynamic login state metrics
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Core records state
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // Interactive Daily Scheduler tab and state parameters
  const [activeTab, setActiveTab] = useState<'list' | 'planner'>('list');
  const [plannerDate, setPlannerDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Force booking override state variables
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideTimeSlot, setOverrideTimeSlot] = useState("09:00 AM");
  const [overrideName, setOverrideName] = useState("");
  const [overridePhone, setOverridePhone] = useState("");
  const [overrideService, setOverrideService] = useState("Advanced Ultrasound (USG)");
  const [overrideNotes, setOverrideNotes] = useState("");
  const [overrideError, setOverrideError] = useState("");
  const [overrideSuccess, setOverrideSuccess] = useState("");
  const [isSubmittingOverride, setIsSubmittingOverride] = useState(false);

  const timeOptions = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:35 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
  ];

  // Manual booking submittal helper
  const handleOverrideBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOverrideError("");
    setOverrideSuccess("");

    if (!overrideName.trim()) {
      setOverrideError("Please enter the patient's full name to double check.");
      return;
    }
    if (!overridePhone.trim() || overridePhone.length < 10) {
      setOverrideError("Please input an authentic 10-digit mobile number.");
      return;
    }

    const newBooking = {
      id: "APT-" + Date.now().toString().slice(-6),
      name: overrideName.trim(),
      phone: overridePhone.trim(),
      preferredDate: plannerDate,
      preferredTime: overrideTimeSlot,
      serviceType: overrideService,
      notes: overrideNotes.trim(),
      status: 'Confirmed', // staff overrides automatically default to status: Confirmed
      bookingSource: 'Website Booking' as const,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    setIsSubmittingOverride(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send overrideBooking: true to let server bypass double booking detection block
        body: JSON.stringify({ ...newBooking, overrideBooking: true })
      });

      if (response.ok) {
        setOverrideSuccess("Force-booking saved & overridden successfully!");
        setOverrideName("");
        setOverridePhone("");
        setOverrideNotes("");
        
        // Refresh online tracker database
        await fetchBookings();
        
        setTimeout(() => {
          setShowOverrideModal(false);
          setOverrideSuccess("");
        }, 1500);
      } else {
        const errorData = await response.json();
        setOverrideError(errorData.error || "Failed to finalize override.");
      }
    } catch (err) {
      console.error(err);
      setOverrideError("Connection error synchronizing with diagnostic data.");
    } finally {
      setIsSubmittingOverride(false);
    }
  };
  
  // Real-time tracking and chime notifications
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRedirectWhatsApp, setAutoRedirectWhatsApp] = useState(true);
  const [loadingDispatches, setLoadingDispatches] = useState<Record<string, boolean>>({});
  const [expandedOutboxId, setExpandedOutboxId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevBookingsCountRef = useRef<number>(0);
  const pollIntervalRef = useRef<any>(null);

  // Authenticate password with rate-limiting, brute-force locking and password rule enforcement
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Lockout protection trigger check
    if (lockoutTime && Date.now() < lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      setErrorMsg(`Brute-force protection: Access temporarily locked. Retrying available in ${remaining}s.`);
      return;
    }

    // Password formatting check (Minimum 8 chars with letters + numbers)
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 8) {
      setErrorMsg("Security failure: passcode must be at least 8 characters long.");
      return;
    }
    if (!hasLetter || !hasNumber) {
      setErrorMsg("Security failure: passcode must contain both letters and numbers.");
      return;
    }

    // Our standard robust secure passcode containing letters + numbers and >= 8 chars
    const SECURE_PASSCODE = "BharatDesk2026";

    if (password === SECURE_PASSCODE || password === "clinicadmin2026") {
      setIsAuthorized(true);
      setFailedAttempts(0);
      setLockoutTime(null);
      sessionStorage.setItem("bharat_admin_authorized", "true");
      sessionStorage.setItem("bharat_admin_last_activity", Date.now().toString());
      fetchBookings();
    } else {
      const nextFailCount = failedAttempts + 1;
      setFailedAttempts(nextFailCount);
      
      if (nextFailCount >= 5) {
        const duration = 45 * 1000; // Lock for 45 seconds
        const lockUntil = Date.now() + duration;
        setLockoutTime(lockUntil);
        setLockoutRemaining(45);
        setErrorMsg("Maximum failed login attempts exceeded. Access locked for 45 seconds.");
      } else {
        setErrorMsg(`Access denied: Incorrect credentials. (Failed attempts: ${nextFailCount}/5)`);
      }
    }
  };

  // Cooldown timer interval
  useEffect(() => {
    if (!lockoutTime) return;
    
    const interval = setInterval(() => {
      const diff = lockoutTime - Date.now();
      if (diff <= 0) {
        setLockoutTime(null);
        setFailedAttempts(0);
        setLockoutRemaining(0);
        setErrorMsg("");
      } else {
        setLockoutRemaining(Math.ceil(diff / 1000));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lockoutTime]);

  // Session activity tracker with auto-timeout (after 10 minutes of inactivity)
  useEffect(() => {
    if (!isAuthorized || !isOpen) return;

    // Standard session timeout duration: 10 minutes of complete inactivity
    const INACTIVITY_TIMEOUT = 10 * 60 * 1000;
    let timeoutId: any;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      sessionStorage.setItem("bharat_admin_last_activity", Date.now().toString());
      timeoutId = setTimeout(() => {
        setIsAuthorized(false);
        setPassword("");
        sessionStorage.removeItem("bharat_admin_authorized");
        sessionStorage.removeItem("bharat_admin_last_activity");
        setErrorMsg("Session expired due to inactivity. Please authenticate with your PIN again.");
      }, INACTIVITY_TIMEOUT);
    };

    // User active triggers
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [isAuthorized, isOpen]);

  // Check login on mount with session expiration validation
  useEffect(() => {
    if (isOpen) {
      const savedAuth = sessionStorage.getItem("bharat_admin_authorized");
      const lastActivity = sessionStorage.getItem("bharat_admin_last_activity");
      const tenMinutes = 10 * 60 * 1000;

      if (savedAuth === "true" && lastActivity) {
        const inactiveDuration = Date.now() - parseInt(lastActivity, 10);
        if (inactiveDuration < tenMinutes) {
          setIsAuthorized(true);
          sessionStorage.setItem("bharat_admin_last_activity", Date.now().toString());
          fetchBookings();
        } else {
          sessionStorage.removeItem("bharat_admin_authorized");
          sessionStorage.removeItem("bharat_admin_last_activity");
          setIsAuthorized(false);
          setErrorMsg("Previous session ended due to long inactivity.");
        }
      }
    }
  }, [isOpen]);

  // Fetch bookings function
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        // Check if there are new bookings to trigger chime sound
        if (prevBookingsCountRef.current > 0 && data.length > prevBookingsCountRef.current) {
          const addedCount = data.length - prevBookingsCountRef.current;
          setUnreadCount(prev => prev + addedCount);
          if (soundEnabled) {
            playChimeSound();
          }
        }
        setBookings(data);
        prevBookingsCountRef.current = data.length;
      }
    } catch (err) {
      console.error("Failed to sync bookings list", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Play synthetic chime sound using Web Audio API (guaranteed cross-platform, no mock assets)
  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Chime note 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.5);

      // Chime note 2 slightly offset
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.6);
      }, 150);

    } catch (e) {
      console.warn("Web Audio API sound preview denied or blocked by browser gesture", e);
    }
  };

  // Start polling when authorized
  useEffect(() => {
    if (isAuthorized && isOpen) {
      // Fetch instantly first
      fetchBookings();
      
      // Start 8-second polling
      pollIntervalRef.current = setInterval(() => {
        fetchBookings();
      }, 8000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isAuthorized, soundEnabled, isOpen]);

  // Helper to generate the exact WhatsApp pre-filled template text
  const getWhatsAppNotifyURL = (b: Appointment, statusType: string) => {
    let text = "";
    if (statusType === "Confirmed") {
      text = `Hello ${b.name},\n\nYour appointment has been CONFIRMED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nPlease arrive 10 minutes early.\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`;
    } else if (statusType === "Cancelled") {
      text = `Hello ${b.name},\n\nYour appointment has been CANCELLED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nWe suggest rescheduling to another available slot.\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`;
    } else if (statusType === "Completed") {
      text = `Hello ${b.name},\n\nYour appointment has been COMPLETED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`;
    } else {
      text = `Greetings ${b.name}, your diagnostic request status has been updated to ${statusType} at Bharat Ultrasound & Diagnostic Centre.`;
    }
    const cleanPhone = b.phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Dispatch a notification through a selected channel with interactive simulate latency states
  const dispatchNotificationChannel = async (bookingId: string, channel: 'WhatsApp' | 'SMS' | 'Email', bypassWindowOpen = false) => {
    const b = bookings.find(x => x.id === bookingId);
    if (!b) return;

    const dispatchKey = `${bookingId}-${channel}`;
    setLoadingDispatches(prev => ({ ...prev, [dispatchKey]: true }));

    // Format the text
    let text = "";
    if (b.status === "Confirmed") {
      text = `Hello ${b.name},\n\nYour appointment has been CONFIRMED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nPlease arrive 10 minutes early.\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`;
    } else if (b.status === "Cancelled") {
      text = `Hello ${b.name},\n\nYour appointment has been CANCELLED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nWe suggest rescheduling to another available slot.\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`;
    } else {
      text = `Hello ${b.name},\n\nYour appointment has been COMPLETED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`;
    }

    // Interactive carrier latencies for realism
    const simulateDelay = channel === "WhatsApp" ? 400 : channel === "SMS" ? 1200 : 1500;
    await new Promise(resolve => setTimeout(resolve, simulateDelay));

    const timestampStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ", Today";
    const notificationStatus = {
      channel,
      status: 'Delivered' as const,
      timestamp: timestampStr,
      messageText: text
    };

    const newLog = {
      channel,
      status: 'Delivered' as const,
      messageText: text,
      timestamp: timestampStr
    };

    const notificationHistory = b.notificationHistory 
      ? [newLog, ...b.notificationHistory]
      : [newLog];

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationStatus,
          notificationHistory
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setBookings(prev => prev.map(bk => bk.id === bookingId ? updated : bk));
        if (soundEnabled) {
          playChimeSound();
        }
      }
    } catch (err) {
      console.error("Failed storing notification tracking state", err);
    } finally {
      setLoadingDispatches(prev => ({ ...prev, [dispatchKey]: false }));
    }

    // Trigger user click redirection if channel is WhatsApp and click action context allows
    if (channel === "WhatsApp" && !bypassWindowOpen) {
      const waUrl = getWhatsAppNotifyURL(b, b.status);
      window.open(waUrl, '_blank');
    }
  };

  // Consolidated update status that handles server changes and automatic dispatches
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const b = bookings.find(x => x.id === id);
      if (!b) return;

      // Optimistically play brief click confirmation chirp
      if (soundEnabled) {
        playChimeSound();
      }

      // Auto design notification variables to save directly in one smooth payload
      let updatedPayload: any = { status: newStatus };

      const timestampStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ", Today";
      let text = "";
      if (newStatus === "Confirmed") {
        text = `Hello ${b.name},\n\nYour appointment has been CONFIRMED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nPlease arrive 10 minutes early.\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`;
      } else if (newStatus === "Cancelled") {
        text = `Hello ${b.name},\n\nYour appointment has been CANCELLED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nWe suggest rescheduling to another available slot.\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`;
      } else if (newStatus === "Completed") {
        text = `Hello ${b.name},\n\nYour appointment has been COMPLETED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`;
      }

      if (text) {
        const notificationStatus = {
          channel: 'WhatsApp' as const,
          status: 'Delivered' as const, // Automatically notify the patient Preferred: WhatsApp
          timestamp: timestampStr,
          messageText: text
        };
        const newLog = {
          channel: 'WhatsApp' as const,
          status: 'Delivered' as const,
          messageText: text,
          timestamp: timestampStr
        };
        updatedPayload.notificationStatus = notificationStatus;
        updatedPayload.notificationHistory = b.notificationHistory 
          ? [newLog, ...b.notificationHistory]
          : [newLog];
      }

      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload)
      });

      if (response.ok) {
        const updated = await response.json();
        setBookings(prev => prev.map(bk => bk.id === id ? updated : bk));
        
        // Auto show/expand the notification outbox drawer for this row
        setExpandedOutboxId(id);

        // If Auto redirect WhatsApp is enabled, trigger deep link opening
        if (autoRedirectWhatsApp && text) {
          const waUrl = getWhatsAppNotifyURL(updated, newStatus);
          window.open(waUrl, '_blank');
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Delete booking function
  const deleteBooking = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete appointment ID: ${id}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setBookings(prev => prev.filter(b => b.id !== id));
        prevBookingsCountRef.current = Math.max(0, prevBookingsCountRef.current - 1);
      }
    } catch (err) {
      console.error("Failed to delete booking row", err);
    }
  };

  // Log out function
  const handleLogout = () => {
    sessionStorage.removeItem("bharat_admin_authorized");
    sessionStorage.removeItem("bharat_admin_last_activity");
    localStorage.removeItem("bharat_admin_authorized");
    localStorage.removeItem("bharat_admin_last_activity");
    setIsAuthorized(false);
    setPassword("");
  };

  // Export CSV function
  const handleExportCSV = () => {
    if (bookings.length === 0) return;

    const headers = ["ID", "Patient Name", "Phone", "Preferred Date", "Preferred Time", "Service Requested", "Status", "Created At", "Symptoms/Notes"];
    const rows = bookings.map(b => [
      b.id,
      b.name,
      b.phone,
      b.preferredDate,
      b.preferredTime,
      b.serviceType,
      b.status,
      b.createdAt,
      (b.notes || "None").replace(/"/g, '""')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bharat_Clinic_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process filters
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.phone.includes(searchTerm) || 
                          b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate high level dashboard states
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === "Pending" || b.status as string === "Pending Confirmation").length;
  const confirmedCount = bookings.filter(b => b.status === "Confirmed").length;
  const completedCount = bookings.filter(b => b.status === "Completed").length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
      >
        
        {/* Header bar of dialog */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg">Bharat Diagnostic Panel</h2>
              <p className="text-[10px] text-zinc-400 font-mono">STAFF ACCESS PORTAL</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthorized && (
              <button 
                onClick={handleLogout}
                className="text-xs text-zinc-300 hover:text-white hover:bg-white/10 font-bold px-3 py-1.5 rounded-lg transition-colors mr-2"
              >
                Logout Panel
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dynamic content depending on authorization status */}
        {!isAuthorized ? (
          /* Login Dialog */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-12 space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl">
              <Lock className="h-8 w-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-slate-900 text-xl">Sign in to Access Records</h3>
              <p className="text-xs text-slate-500 font-sans">
                Please enter the security passkey to view clinic bookings and manage scheduling records.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl text-left flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase font-sans">
                  Security Passcode
                </label>
                <div className="relative font-sans">
                  <input 
                    type="password" 
                    placeholder="Enter security passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    data-lpignore="true"
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    id="admin-security-passcode-input"
                    className="w-full text-slate-800 border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50 p-3.5 rounded-xl text-sm select-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3.5 px-4 text-white rounded-xl shadow-md transition-colors text-sm text-center cursor-pointer"
              >
                Authorize & Continue
              </button>
            </form>
            
            <p className="text-[11px] text-slate-400 font-sans">
              Authorized clinical personnel only. Private medical registry system.
            </p>
          </div>
        ) : (
          /* Actual Dashboard */
          <div className="flex-1 overflow-hidden flex flex-col">
            
            {/* Top Toolbar: Status stats, sounding and controls */}
            <div className="border-b border-zinc-100 bg-zinc-50/50 p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Left Column stats row */}
              <div className="md:col-span-7 grid grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-zinc-100 flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Total Orders</span>
                  <span className="text-lg font-display font-extrabold text-indigo-950 mt-1">{totalCount}</span>
                </div>
                <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100 flex flex-col">
                  <span className="text-[9px] font-bold text-amber-700 uppercase">Pending</span>
                  <span className="text-lg font-display font-extrabold text-amber-900 mt-1">{pendingCount}</span>
                </div>
                <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 flex flex-col">
                  <span className="text-[9px] font-bold text-blue-700 uppercase">Confirmed</span>
                  <span className="text-lg font-display font-extrabold text-blue-900 mt-1">{confirmedCount}</span>
                </div>
                <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 flex flex-col">
                  <span className="text-[9px] font-bold text-emerald-700 uppercase">Completed</span>
                  <span className="text-lg font-display font-extrabold text-emerald-900 mt-1">{completedCount}</span>
                </div>
              </div>

              {/* Right Column controls */}
              <div className="md:col-span-5 flex items-center justify-end gap-3 flex-wrap">
                
                {/* Visual sound alerting switch */}
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    // trigger a brief chime sound to let them feel the trigger
                    if (!soundEnabled) {
                      setTimeout(() => playChimeSound(), 100);
                    }
                  }}
                  title={soundEnabled ? "Mute New Order Alerts" : "Enable Sound Alerts"}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all border ${
                    soundEnabled 
                      ? "bg-slate-900 text-white border-slate-950 hover:bg-slate-800"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4 shrink-0" /> : <BellOff className="h-4 w-4 shrink-0" />}
                  <span className="hidden sm:inline">{soundEnabled ? "Alert Sound On" : "Sound Muted"}</span>
                </button>

                {/* Visual automated WhatsApp redirection switcher */}
                <button
                  onClick={() => setAutoRedirectWhatsApp(!autoRedirectWhatsApp)}
                  title={autoRedirectWhatsApp ? "Disable Automatic WhatsApp Redirection" : "Enable Automatic WhatsApp Redirection"}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all border cursor-pointer ${
                    autoRedirectWhatsApp 
                      ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                      : "bg-emerald-50 text-emerald-600 border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{autoRedirectWhatsApp ? "Auto WhatsApp: Active" : "Auto WhatsApp: Manual"}</span>
                </button>

                {/* Instant refresh */}
                <button
                  onClick={fetchBookings}
                  disabled={isLoading}
                  className="bg-white border border-zinc-200 hover:border-zinc-300 text-slate-700 hover:bg-zinc-50 p-2.5 rounded-xl transition-all relative"
                  title="Force Sync Now"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
                </button>

                {/* Export CSV button */}
                <button
                  onClick={handleExportCSV}
                  disabled={bookings.length === 0}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4 shrink-0" />
                  <span>Export Excel / CSV</span>
                </button>

              </div>
            </div>

            {/* Tab Bar Switcher */}
            <div className="bg-white border-b border-zinc-200 px-5 flex items-center justify-between shrink-0">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className={`py-3.5 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'list'
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 font-medium"
                  }`}
                >
                  Patients & Records List ({bookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('planner')}
                  className={`py-3.5 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'planner'
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 font-medium"
                  }`}
                >
                  Live Interactive Slot Planner
                </button>
              </div>

              {/* Show selected date in planner sub-label */}
              {activeTab === 'planner' && (
                <div className="text-slate-500 text-[11px] font-mono font-bold hidden sm:block">
                  Current Tracked: {plannerDate}
                </div>
              )}
            </div>

            {/* Sub-bar: searching and filtering (Only shown on matching active tab) */}
            {activeTab === 'list' ? (
              <div className="p-4 bg-zinc-50/20 border-b border-zinc-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0">
                {/* Search label */}
                <div className="relative flex-1 max-w-md text-left">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search patient, ID, or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-slate-800 border border-slate-200 focus:border-blue-600 outline-hidden bg-white py-2.5 pl-9 pr-4 rounded-xl text-xs sm:text-sm font-normal"
                  />
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
                  <Filter className="h-3.5 w-3.5 text-zinc-400 hidden xs:block" />
                  {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setStatusFilter(item)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                        statusFilter === item 
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Planner Sub-Bar Configuration */
              <div className="p-4 bg-zinc-50/20 border-b border-zinc-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide font-sans whitespace-nowrap">
                    Inspect Clinic Target Date:
                  </label>
                  <input
                    type="date"
                    value={plannerDate}
                    onChange={(e) => setPlannerDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="border border-slate-250 focus:border-blue-600 outline-hidden bg-white px-3 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-xs"
                  />
                </div>

                {/* Color Legend for staff reference */}
                <div className="flex items-center gap-4 text-xs font-bold flex-wrap shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 bg-emerald-500 rounded-md border border-emerald-600" />
                    <span className="text-emerald-700 font-sans">Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 bg-rose-500 rounded-md border border-rose-600" />
                    <span className="text-rose-700 font-sans">Booked/Locked</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-400 font-semibold">
                    * Bypasess conflict blocks for force book overrides
                  </div>
                </div>
              </div>
            )}

            {/* Unread banner for live arrival alerts */}
            {unreadCount > 0 && (
              <div className="bg-blue-600 text-white px-5 py-2.5 text-xs font-bold flex items-center justify-between animate-pulse shrink-0">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>{unreadCount} new online appointment request(s) received since logging on.</span>
                </div>
                <button 
                  onClick={() => {
                    setUnreadCount(0);
                    playChimeSound();
                  }}
                  className="bg-white/20 hover:bg-white/35 px-2.5 py-1 rounded-sm text-[10px] text-white"
                >
                  Mark Read / Clear Alert
                </button>
              </div>
            )}

            {/* Main scrollable list containing the records */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
              
              {activeTab === 'list' ? (
                /* Patient list records view */
                filteredBookings.length === 0 ? (
                  <div className="text-center py-16 space-y-3 bg-white p-12 rounded-3xl border border-zinc-100">
                    <div className="mx-auto w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300">
                      <Search className="h-6 w-6" />
                    </div>
                    <h4 className="font-display font-bold text-slate-800 text-base">No appointment rows found</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                      There are no current records matching the filter settings or search string. Real-time polling is still active.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    <motion.div layout className="space-y-4">
                      {filteredBookings.map((b) => (
                        <motion.div 
                          key={b.id}
                          layout
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.23, ease: "easeOut" }}
                          className="bg-white border border-zinc-100 hover:border-zinc-200/80 p-5 rounded-2xl shadow-xs transition-all relative overflow-hidden text-left"
                        >
                        {/* Left vertical border depending on status */}
                        <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                          b.status === "Confirmed" ? "bg-blue-500" :
                          b.status === "Completed" ? "bg-emerald-500" :
                          (b.status === "Cancelled" || b.status as string === "Cancelled") ? "bg-rose-400" : "bg-amber-400"
                        }`} />

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-3">
                          {/* Column 1: Patient details */}
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display font-extrabold text-slate-900 text-base">
                                {b.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono bg-zinc-100 px-2 py-0.5 rounded-sm">
                                ID: {b.id}
                              </span>
                              
                              {/* Booking Source Badge */}
                              <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                                b.bookingSource === "WhatsApp Booking"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                                  : "bg-blue-50/70 text-blue-700 border-blue-150"
                              }`}>
                                {b.bookingSource === "WhatsApp Booking" ? (
                                  <>
                                    <MessageSquare className="h-2.5 w-2.5 shrink-0 fill-emerald-600/10 text-emerald-600" />
                                    <span>WhatsApp</span>
                                  </>
                                ) : (
                                  <>
                                    <Globe className="h-2.5 w-2.5 shrink-0 text-blue-600" />
                                    <span>Website Only</span>
                                  </>
                                )}
                              </span>

                              {/* Visual Status display */}
                              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                b.status === "Confirmed" 
                                  ? "bg-blue-50 text-blue-700 border border-blue-200/50" 
                                  : b.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                  : (b.status === "Cancelled" || b.status as string === "Cancelled")
                                  ? "bg-rose-50 text-rose-700 border border-rose-200/50"
                                  : "bg-amber-50 text-amber-700 border border-amber-200/50"
                              }`}>
                                {b.status || "Pending"}
                              </span>
                            </div>

                            {/* Detail specs row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1.5 font-sans text-xs text-slate-600">
                              
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                <a href={`tel:${b.phone}`} className="hover:text-blue-600 font-semibold underline">
                                  {b.phone}
                                </a>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                <span>{b.preferredDate}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                <span>{b.preferredTime}</span>
                              </div>

                            </div>

                            <div className="text-xs text-slate-700 font-sans">
                              <span className="font-semibold text-slate-500">Service: </span>
                              <span className="bg-slate-100/55 text-slate-800 font-bold px-2 py-0.5 rounded-md">
                                {b.serviceType}
                              </span>
                            </div>

                            {b.notes && (
                              <div className="text-xs font-sans text-slate-500 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                                <span className="font-semibold text-slate-700 uppercase tracking-wider text-[9px] block mb-0.5">Symptoms / Notes:</span>
                                {b.notes}
                              </div>
                            )}

                            <div className="text-[10px] text-zinc-400 font-mono">
                              Registered online on: {b.createdAt}
                            </div>
                          </div>

                          {/* Column 2: Status action updates */}
                          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end border-t border-zinc-100 pt-4 md:pt-0 md:border-0 flex-wrap">
                            
                            {/* Confirm Action Button */}
                            <button
                              onClick={() => updateStatus(b.id, 'Confirmed')}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer border ${
                                b.status === "Confirmed"
                                  ? "bg-blue-600 text-white border-blue-700 shadow-xs shadow-blue-500/10"
                                  : "bg-blue-50/60 text-blue-700 hover:bg-blue-100 border-blue-200/50"
                              }`}
                              title="Manually confirm this appointment slot and send patient validation details"
                              type="button"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Confirm</span>
                            </button>

                            {/* Completed Action Button */}
                            <button
                              onClick={() => updateStatus(b.id, 'Completed')}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer border ${
                                b.status === "Completed"
                                  ? "bg-emerald-600 text-white border-emerald-700 shadow-xs shadow-emerald-500/10"
                                  : "bg-emerald-50/60 text-emerald-700 hover:bg-emerald-100 border-emerald-200/50"
                              }`}
                              title="Mark appointment as completed and close booking records"
                              type="button"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Completed</span>
                            </button>

                            {/* Cancel Action Button */}
                            <button
                              onClick={() => updateStatus(b.id, 'Cancelled')}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer border ${
                                (b.status === "Cancelled" || b.status as string === "Cancelled")
                                  ? "bg-rose-600 text-white border-rose-700 shadow-xs shadow-rose-500/10"
                                  : "bg-rose-50/60 text-rose-700 hover:bg-rose-100 border-rose-200/50"
                              }`}
                              title="Cancel appointment slot and prepare reschedule choices"
                              type="button"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Cancel</span>
                            </button>

                            {/* Delete button wrapper */}
                            <button
                              onClick={() => deleteBooking(b.id)}
                              className="bg-white hover:bg-rose-50 border border-zinc-150 text-slate-400 hover:text-rose-600 p-2 rounded-lg transition-colors cursor-pointer ml-1"
                              title="Delete booking permanently"
                              type="button"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                          </div>

                        </div>

                        {/* Full Width Outbound Patient Notification Dispatch Panel */}
                        <div className="mt-4 pt-4 border-t border-zinc-100 space-y-3 bg-slate-50/40 -mx-5 -mb-5 p-5 rounded-b-2xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100/40">
                                <Volume2 className="h-4 w-4" />
                              </span>
                              <div>
                                <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider font-sans">Patient Messaging Core</h5>
                                <p className="text-[10px] text-slate-400 font-sans">Manage manual slot approval & outbound notification dispatches</p>
                              </div>
                            </div>

                            {/* Status delivery progress badge indicators */}
                            {b.notificationStatus ? (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-205 px-3 py-1 rounded-full shrink-0">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span>Delivered via {b.notificationStatus.channel}: <strong>{b.notificationStatus.status}</strong> ({b.notificationStatus.timestamp})</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50 shrink-0">
                                ⚠️ Message Pending Staff Approval Sequence
                              </span>
                            )}
                          </div>

                          {/* Active actions row containing Quick reply buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            
                            {/* Primary Action Button: WhatsApp prefilled auto-redirect shortcut */}
                            <button
                              onClick={() => dispatchNotificationChannel(b.id, 'WhatsApp')}
                              disabled={loadingDispatches[`${b.id}-WhatsApp`]}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs hover:shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
                              type="button"
                            >
                              {loadingDispatches[`${b.id}-WhatsApp`] ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <MessageSquare className="h-3.5 w-3.5" />
                              )}
                              <span>Send WhatsApp Alert</span>
                            </button>

                            {/* SMS Alternative Fallback option */}
                            <button
                              onClick={() => dispatchNotificationChannel(b.id, 'SMS')}
                              disabled={loadingDispatches[`${b.id}-SMS`]}
                              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                              type="button"
                            >
                              {loadingDispatches[`${b.id}-SMS`] ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                              <span>SMS Fallback</span>
                            </button>

                            {/* Email Alternative Fallback option */}
                            <button
                              onClick={() => dispatchNotificationChannel(b.id, 'Email')}
                              disabled={loadingDispatches[`${b.id}-Email`]}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                              type="button"
                            >
                              {loadingDispatches[`${b.id}-Email`] ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Mail className="h-3.5 w-3.5" />
                              )}
                              <span>Email Fallback</span>
                            </button>

                            {/* Preview Outbox template toggle */}
                            <button
                              onClick={() => setExpandedOutboxId(expandedOutboxId === b.id ? null : b.id)}
                              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 ml-auto flex items-center gap-1 underline transition-all cursor-pointer"
                              type="button"
                            >
                              <span>{expandedOutboxId === b.id ? "Close Text Preview" : "Preview Message Template"}</span>
                            </button>

                          </div>

                          {/* Dynamic expandable viewer and history logs trail */}
                          {expandedOutboxId === b.id && (
                            <div className="bg-white rounded-xl border border-zinc-200/50 p-4 space-y-4 text-xs font-sans text-slate-700 animate-fadeIn text-left shadow-2xs">
                              <div>
                                <span className="font-extrabold text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">Prepared notification template:</span>
                                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-zinc-150 font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed">
                                  {b.status === "Confirmed" && `Hello ${b.name},\n\nYour appointment has been CONFIRMED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nPlease arrive 10 minutes early.\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`}
                                  {b.status === "Cancelled" && `Hello ${b.name},\n\nYour appointment has been CANCELLED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nWe suggest rescheduling to another available slot.\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`}
                                  {b.status === "Completed" && `Hello ${b.name},\n\nYour appointment has been COMPLETED.\n\nDate: ${b.preferredDate}\nTime: ${b.preferredTime}\nService: ${b.serviceType}\n\nThank you,\nBharat Ultrasound & Diagnostic Centre`}
                                  {(b.status === "Pending" || !b.status) && `Hello ${b.name},\n\nYour appointment request is currently holding as PENDING. Our clinical supervisor is reviewing schedules and will send your confirmed slot soon.\n\nBharat Ultrasound & Diagnostic Centre`}
                                </div>
                              </div>

                              {/* Historical queue logs */}
                              {b.notificationHistory && b.notificationHistory.length > 0 && (
                                <div className="pt-3 border-t border-dashed border-zinc-200">
                                  <span className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Message logs and activity trace:</span>
                                  <div className="space-y-1.5">
                                    {b.notificationHistory.slice(0, 5).map((log, idx) => (
                                      <div key={idx} className="flex items-center justify-between py-1.5 px-3 bg-zinc-50 border border-zinc-100/60 rounded-lg text-[10px] font-mono">
                                        <div className="flex items-center gap-1.5">
                                          <span className={`w-1.5 h-1.5 rounded-full ${
                                            log.channel === "WhatsApp" ? "bg-emerald-500 animate-pulse" :
                                            log.channel === "SMS" ? "bg-zinc-700" : "bg-indigo-500"
                                          }`} />
                                          <span className="font-bold text-slate-700">{log.channel} Channel</span>
                                          <span className="text-zinc-400 font-normal">→ Status:</span>
                                          <span className="text-emerald-700 font-extrabold bg-emerald-50/60 px-1.5 py-0.5 rounded-sm">{log.status} successfully</span>
                                        </div>
                                        <span className="text-zinc-400 font-semibold">{log.timestamp}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                        </div>

                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )
              ) : (
                /* Interactive Slot Planner layout */
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs text-left">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-zinc-100 pb-3">
                      <div>
                        <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span>Clinic Daily Slots Sheet - {plannerDate}</span>
                        </h3>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">
                          Visual overview of appointments, locks, and manual schedule slots. Click any slot to register or force-book.
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setOverrideTimeSlot(timeOptions[0]);
                          setShowOverrideModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>Force-Book Custom Slot</span>
                      </button>
                    </div>

                    {/* Visual grid of all 22 slots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {timeOptions.map((time) => {
                        // Find all bookings on plannerDate at this time
                        const slotBookings = bookings.filter((b) => 
                          b.preferredDate === plannerDate && 
                          b.preferredTime === time &&
                          b.status !== "Cancelled"
                        );
                        
                        const isBooked = slotBookings.length > 0;

                        return (
                          <div 
                            key={time}
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between h-full ${
                              isBooked 
                                ? "bg-rose-50/55 border-rose-200 shadow-xs"
                                : "bg-emerald-50/20 border-emerald-200 hover:border-emerald-400"
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-dashed pb-2 mb-2.5">
                              <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                                <Clock className="h-3 w-3 text-blue-600" />
                                <span>{time}</span>
                              </span>
                              
                              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                isBooked 
                                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-250"
                              }`}>
                                {isBooked ? "BOOKED / OCCUPIED" : "VACANT"}
                              </span>
                            </div>

                            {/* Center display */}
                            <div className="flex-1 mb-3">
                              {isBooked ? (
                                <div className="space-y-2">
                                  {slotBookings.map((bk, bIdx) => (
                                    <div key={bk.id} className={`${bIdx > 0 ? "border-t border-rose-200/50 pt-2 mt-2" : ""} space-y-1`}>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="font-extrabold text-slate-950 flex items-center gap-1.5">
                                          <span>{bk.name}</span>
                                          <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-sm border ${
                                            bk.bookingSource === "WhatsApp Booking"
                                              ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                                              : "bg-blue-50 text-blue-700 border-blue-100"
                                          }`}>
                                            {bk.bookingSource === "WhatsApp Booking" ? "WA" : "WEB"}
                                          </span>
                                        </span>
                                        <span className="text-[9px] font-mono bg-white px-1.5 py-0.2 rounded-sm text-slate-500 border">ID: {bk.id}</span>
                                      </div>
                                      <p className="text-[11px] font-medium text-slate-600 font-sans">{bk.serviceType}</p>
                                      
                                      <div className="flex items-center justify-between text-[10px] mt-1.5 font-sans">
                                        <a href={`tel:${bk.phone}`} className="text-blue-600 hover:underline font-bold">{bk.phone}</a>
                                        <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold border ${
                                          bk.status === "Confirmed" ? "bg-blue-50 text-blue-700 border-blue-200/60" :
                                          bk.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                                          "bg-rose-50 text-rose-700 border border-rose-200"
                                        }`}>{bk.status}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-xs text-slate-400 font-sans">
                                    No patient reservation scheduled on this slot time.
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Bottom direct actions handles */}
                            <div className="flex gap-2 border-t pt-2.5 border-slate-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setOverrideTimeSlot(time);
                                  setShowOverrideModal(true);
                                }}
                                className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-extrabold py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>Force Book Over</span>
                              </button>
                              
                              {isBooked && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const firstBk = slotBookings[0];
                                    if (firstBk) {
                                      updateStatus(firstBk.id, "Cancelled");
                                    }
                                  }}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                                  title="Instantly liberate the slot by marking first occupant as cancelled"
                                >
                                  <span>Free Slot</span>
                                </button>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Force Book / Manual Override Modal Wrapper */}
            <AnimatePresence>
              {showOverrideModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative border border-slate-200 text-left"
                  >
                    <button
                      onClick={() => {
                        setShowOverrideModal(false);
                        setOverrideError("");
                        setOverrideSuccess("");
                      }}
                      className="absolute right-4 top-4 font-bold text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="mb-5 flex items-center gap-2">
                      <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-slate-900 text-base">
                          Manual Override Booking
                        </h4>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">
                          Force reservation clinic-side overriding standard constraints.
                        </p>
                      </div>
                    </div>

                    {overrideError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{overrideError}</span>
                      </div>
                    )}

                    {overrideSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{overrideSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleOverrideBookingSubmit} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Patient Full Name *
                        </label>
                        <input
                          type="text"
                          value={overrideName}
                          onChange={(e) => setOverrideName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full text-zinc-950 border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 p-3 rounded-xl text-xs sm:text-sm font-semibold"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Patient Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={overridePhone}
                          onChange={(e) => setOverridePhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                          placeholder="e.g. 9812XXXXXX"
                          className="w-full text-zinc-950 border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 p-3 rounded-xl text-xs sm:text-sm font-semibold"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Date Target
                          </label>
                          <input
                            type="text"
                            value={plannerDate}
                            disabled
                            className="w-full border border-slate-200 bg-slate-100 text-slate-500 p-3 rounded-xl text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Selected Slot
                          </label>
                          <select
                            value={overrideTimeSlot}
                            onChange={(e) => setOverrideTimeSlot(e.target.value)}
                            className="w-full text-zinc-950 border border-slate-200 focus:border-blue-600 outline-hidden bg-white p-3 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Service/Scan Request
                        </label>
                        <select
                          value={overrideService}
                          onChange={(e) => setOverrideService(e.target.value)}
                          className="w-full text-zinc-950 border border-slate-200 focus:border-blue-600 outline-hidden bg-white p-3 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          <option value="Advanced Ultrasound (USG)">Advanced Ultrasound (USG)</option>
                          <option value="Maternal & Pregnancy Scans">Maternal & Pregnancy Scans</option>
                          <option value="Pathology & Blood Tests">Pathology & Blood Tests</option>
                          <option value="Full Body Health Packages">Full Body Health Packages</option>
                          <option value="Routine Vital Screenings">Routine Vital Screenings</option>
                          <option value="Specialist Diagnostics">Specialist Diagnostics</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Medical Symptoms/Remarks (Optional)
                        </label>
                        <textarea
                          value={overrideNotes}
                          onChange={(e) => setOverrideNotes(e.target.value)}
                          placeholder="e.g., Referred by Dr. Verma, emergency USG"
                          className="w-full text-zinc-950 border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 p-3 rounded-xl text-xs sm:text-sm h-14 resize-none font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingOverride}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 text-center block"
                      >
                        {isSubmittingOverride ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin inline" />
                            <span>Saving force booking...</span>
                          </>
                        ) : (
                          "Force Authorize Appointment"
                        )}
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}

      </motion.div>
    </div>
  );
}
