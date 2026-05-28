export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  detailedDescription: string;
  iconName: string;
  priceEstimate?: string;
  preparationTips: string[];
  durationMinutes: number;
}

export interface NotificationLog {
  channel: 'WhatsApp' | 'SMS' | 'Email';
  status: 'Idle' | 'Sending' | 'Sent' | 'Failed' | 'Delivered';
  messageText: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  serviceType: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
  bookingSource?: 'WhatsApp Booking' | 'Website Booking';
  notificationStatus?: {
    channel: 'WhatsApp' | 'SMS' | 'Email';
    status: 'Idle' | 'Sending' | 'Sent' | 'Failed' | 'Delivered';
    timestamp?: string;
    messageText?: string;
  };
  notificationHistory?: NotificationLog[];
}

export interface Review {
  id: string;
  authorName: string;
  authorPrefix?: string; // e.g., "Verified Patient"
  rating: number;
  date: string;
  comment: string;
  treatmentName: string;
  isVerified: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}
