import { Service, Review, FAQItem } from './types';

export const CLINIC_INFO = {
  name: "Bharat Ultrasound And Diagnostic Centre",
  tagline: "Trusted Ultrasound & Diagnostic Services with Fast Reports & Easy Appointments",
  address: "SCO 42, First Floor, Sector 31 Market, Gurugram, Haryana 122001",
  landmark: "Opposite Sector 31 HUDA Market complex, near NH-48",
  phone: "+91 8130246176",
  secondaryPhone: "+91 9811029512",
  whatsapp: "+91 8130246176",
  email: "info@bharatdiagnostic.com",
  timings: "Monday - Saturday: 8:00 AM - 8:00 PM | Sunday: 9:00 AM - 2:00 PM (Prior Booking Recommended)",
  googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.97022067822!2d77.04256247631773!3d28.450319775764835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e807218653%3A0xe16bfbc7cebfb95a!2sSector%2031%20Market!5e0!3m2!1sen!2sin!4v1716731234567!5m2!1sen!2sin",
  doctorInCharge: "Dr. Sandeep Sharma, MBBS, MD (Radio-diagnosis)",
  experience: "Over 18+ Years of Academic & Clinical Excellence"
};

export const SERVICES: Service[] = [
  {
    id: "ultrasound",
    title: "Advanced Ultrasound (USG)",
    category: "Scans",
    description: "High-resolution ultrasound scans of abdomen, pelvis, small parts, and joints using state-of-the-art machines.",
    detailedDescription: "Our clinic is equipped with the latest 3D/4D ultrasound systems. We perform comprehensive scans including Whole Abdomen, Pelvis, KUB, Follicular Monitoring, Thyroid, Breast, Scrotum, and Musculoskeletal (MSK) scans.",
    iconName: "Activity",
    priceEstimate: "Starts at ₹999",
    durationMinutes: 15,
    preparationTips: [
      "For Upper Abdomen / KUB scans, fast for at least 6-8 hours before the scan (water is allowed).",
      "For Pelvic / Follicular scans, a full bladder is necessary. Drink 4-5 glasses of water 1 hour prior to your scan and do not urinate."
    ]
  },
  {
    id: "pregnancy-scan",
    title: "Maternal & Pregnancy Scans",
    category: "Specialized Scans",
    description: "Specialized scans for tracking fetal development across all trimesters including NT and Anomaly scans.",
    detailedDescription: "High-precision obstetric scans mapping baby growth, amniotic fluid, and fetal safety. Includes Viability Scan, NT Scan (Nuchal Translucency), Level II / TIFFA (Anomaly Scan), Fetal Doppler, and Growth Scans.",
    iconName: "Heart",
    priceEstimate: "Starts at ₹1,499",
    durationMinutes: 25,
    preparationTips: [
      "Wear loose, comfortable clothing (two-piece outfits preferred).",
      "Generally, early pregnancy scans (1st trimester) require a full bladder. Drink 3-4 glasses of water 1 hour before the appointment.",
      "Bring all previous trimesters' records and file files for doctor's comparison."
    ]
  },
  {
    id: "blood-test",
    title: "Pathology & Blood Tests",
    category: "Diagnostics",
    description: "Comprehensive array of blood, urine, and pathology investigations using modern automated labs.",
    detailedDescription: "Accurate blood testing, including CBC, Liver Function Test (LFT), Kidney Function Test (KFT), Thyroid Profile, Diabetes Screen (HbA1c), Lipid Profile, and Vitamin levels, with fully digitalized sample tracking.",
    iconName: "Thermometer",
    priceEstimate: "Starts at ₹299",
    durationMinutes: 10,
    preparationTips: [
      "For Blood Sugar (Fasting) & Lipid Profiles, 10-12 hours of overnight fasting is mandatory.",
      "Avoid consuming coffee, tea, or smoking during the fasting window.",
      "Drinking plain water is allowed and recommended to keep veins hydrated."
    ]
  },
  {
    id: "routine-scanning",
    title: "Routine Vital Screenings",
    category: "Scans",
    description: "Quick screening for key body vitals, organ wellness checks, and abdominal health tracking.",
    detailedDescription: "Basic scans tracking visceral health, liver grade fat, gallstone diagnosis, kidney size check, and appendix scanning suitable for preventative checkups and routine symptoms management.",
    iconName: "Eye",
    priceEstimate: "Starts at ₹799",
    durationMinutes: 15,
    preparationTips: [
      "Prior light meal is recommended, avoid greasy food on the previous night.",
      "Keep loose clothing on for swift diagnostic operations."
    ]
  },
  {
    id: "health-checkups",
    title: "Full Body Health Packages",
    category: "Wellness",
    description: "Bundled preventive screenings combining essential blood panels, urine tests, vitals, and USG.",
    detailedDescription: "Preventive health packages designed for modern stress profiles, including lipid panels, renal indicators, liver enzymes, chest screening, abdominal USG, and specialist general practitioner consultancy.",
    iconName: "ClipboardCheck",
    priceEstimate: "Starts at ₹1,999",
    durationMinutes: 45,
    preparationTips: [
      "12-hour overnight fasting required.",
      "Collect morning mid-stream urine sample in the sterile container provided at our reception.",
      "Bring a list of all current chronic medications."
    ]
  },
  {
    id: "specialist-diagnostics",
    title: "Specialty Diagnostic Panels",
    category: "Diagnostics",
    description: "Cardiac diagnostics, digital ECG, thyroid specialized workups, and custom clinical screenings.",
    detailedDescription: "High-accuracy digital ECG, specialist thyroid hormone panels, fertility endocrine workups (FSH, LH, Prolactin), and advanced diabetic reviews to ensure targeted treatment protocols.",
    iconName: "ShieldCheck",
    priceEstimate: "Starts at ₹499",
    durationMinutes: 20,
    preparationTips: [
      "Avoid strenuous exercise 2 hours before ECG testing.",
      "Female hormone levels should ideally be tracked based on menstrual cycle days as advised by your doctor."
    ]
  }
];

export const CONVENIENCE_FEATURES = [
  {
    title: "No Long Waiting Times",
    description: "Strict slot scheduling and dual scanning machines ensure you get scanned within 15-20 minutes of your scheduled time.",
    iconName: "Clock"
  },
  {
    title: "Instant Digital Reports",
    description: "Ultrasound reports are signed and handed over within 30 minutes. Pathology reports are sent on WhatsApp and Email same-day.",
    iconName: "FileText"
  },
  {
    title: "Direct WhatsApp Booking",
    description: "Skip phone hold times. Send a text on WhatsApp to instantly reserve your preferred date, or ask preparation doubts directly to our team.",
    iconName: "MessageCircle"
  },
  {
    title: "In-Centre Patient Comfort",
    description: "Air-conditioned spacious waiting lounge, free reverse-osmosis drinking water, clear sanitization routines, and highly helpful female nursing attendees.",
    iconName: "Shield"
  },
  {
    title: "Central Gurugram Hub",
    description: "Located right in Sector 31 Market, easily reachable via NH-48 and close to multiple prominent schools and pharmacies.",
    iconName: "MapPin"
  }
];

export const WHY_CHOOSE_US = [
  {
    id: "trusted",
    title: "Trusted & Certified Centre",
    description: "Highly recognized diagnostic provider obeying strict clinical standards and state PC-PNDT regulations with rigorous quality control."
  },
  {
    id: "staff",
    title: "Senior Medical Radiologist",
    description: "All scans conducted and reports authored by Dr. Sandeep Sharma, MD (Radiology) with 18+ years of dedicated clinical diagnostic expertise."
  },
  {
    id: "reports",
    title: "Unmatched Accuracy Rates",
    description: "Equipped with state-of-the-art diagnostic probes and high frequency imaging technology to catch the smallest clinical details with zero error margins."
  },
  {
    id: "hygiene",
    title: "100% Hygenic Environment",
    description: "Rigorous sanitation of probe heads and examination beds with medical-grade sterilizer sprays before every single patient scan."
  },
  {
    id: "quick",
    title: "Same Day Integrated Lab Results",
    description: "Integrated in-house diagnostics and pathology systems mean your combined blood and scan analysis reports are ready concurrently."
  },
  {
    id: "friendly",
    title: "Patient-First Respect & Care",
    description: "Our female nurses and support staff ensure exceptional privacy, high dignity, and comfort for expecting mothers and elderly patients."
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev1",
    authorName: "Anjali Khanna",
    authorPrefix: "Verified Patient",
    rating: 5,
    date: "14 May, 2026",
    comment: "I went here for my Level 2 Pregnancy Scan. Dr. Sandeep was incredibly patient. He explained dynamic fetal parameters clearly and verified every organ. The staff helped me with cushions. Highly recommend!",
    treatmentName: "Pregnancy Scan",
    isVerified: true
  },
  {
    id: "rev2",
    authorName: "Rajesh Yadav",
    authorPrefix: "Review from Sector 45",
    rating: 5,
    date: "02 May, 2026",
    comment: "Excellent experience. I had written symptoms and booked an abdominal scan. Got the report within 25 minutes! Very hygienic and modern machines compared to other massive crowded hospitals in Gurugram.",
    treatmentName: "Ultrasound",
    isVerified: true
  },
  {
    id: "rev3",
    authorName: "Dr. Pallavi Mehra",
    authorPrefix: "Referring Gynecologist",
    rating: 5,
    date: "22 April, 2026",
    comment: "As a clinician, I trust Bharat Ultrasound. Dr. Sandeep's diagnostic accuracy is excellent. There is no unnecessary waiting for my pregnant patients. Five stars for professional setup and fast diagnostic outputs.",
    treatmentName: "Diagnostic Services",
    isVerified: true
  },
  {
    id: "rev4",
    authorName: "Amit Singhal",
    authorPrefix: "Verified Patient",
    rating: 4,
    date: "10 April, 2026",
    comment: "Efficient and clean. Took my mother for a routine gallbladder scan and thyroid panel. The blood collection was painless, and the staff helped us with a wheelchair. Very convenient location in Sector 31.",
    treatmentName: "Health Checkups",
    isVerified: true
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Do I need to carry any ID proof for an ultrasound?",
    answer: "According to PC-PNDT regulations in India, for all obstetric (pregnancy) scans, a valid Government ID card (Aadhar Card, Voter ID, or Passport) along with a valid Doctor's prescription is absolutely mandatory to present before starting the scan."
  },
  {
    question: "How long does it take to get my Ultrasound report?",
    answer: "We value your time. Ultrasound scanning reports are custom-drafted, cross-signed, and handed to you directly at the clinic within 25 to 30 minutes of completing the procedure."
  },
  {
    question: "Can I book an appointment online or through WhatsApp?",
    answer: "Yes, definitely. You can book directly using our website appointment form, or by clicking the WhatsApp button. Our coordinator will match your details and confirm a slot within 10 minutes."
  },
  {
    question: "Are card payments or UPI accepted?",
    answer: "Yes, we accept all forms of payment, including Google Pay, PhonePe, Paytm, BHIM UPI, debit/credit cards, and cash."
  }
];
