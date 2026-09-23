export type Role = 'customer' | 'worker' | 'cooperative';

export type Language = 'en' | 'ta' | 'hi';

export type ServiceCategory =
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Painter'
  | 'Cleaner'
  | 'Caregiver'
  | 'Driver'
  | 'Gardener'
  | 'Technician';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'simulated';

export interface Worker {
  id: string;
  name: string;
  trade: ServiceCategory;
  cooperative: string;
  verification: VerificationStatus;
  rating: number;
  completedJobs: number;
  experience: string;
  skills: string[];
  distance?: number;
  availability: string;
  availableToday: boolean;
  serviceArea: string;
  phone: string;
  priceRange: [number, number];
  avatar: string; // initials-based
  documents: {
    identity: boolean;
    skillCertificate: boolean;
    cooperativeMembership: boolean;
  };
}

export interface Booking {
  id: string;
  service: ServiceCategory;
  workerId: string;
  workerName: string;
  customerName: string;
  customerPhone: string;
  location: string;
  date: string;
  time: string;
  notes: string;
  status: BookingStatus;
  amount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  rating?: number;
  review?: string;
}

export interface DemandForecast {
  service: ServiceCategory;
  zone: string;
  currentDemand: number;
  predictedDemand: number;
  confidence: number;
  recommendation: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  platformFee: number;
  workerPayout: number;
  status: PaymentStatus;
  date: string;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'verification' | 'payment' | 'system';
}
