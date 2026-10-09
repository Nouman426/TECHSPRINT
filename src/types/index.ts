export type UserRole = 'professional' | 'client' | 'admin';

export type AccountStatus = 'active' | 'suspended';

export interface User {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  accountStatus: AccountStatus;
  profilePhotoUrl?: string;
  phoneNumber?: string;
  clientType?: 'Individual' | 'Student' | 'Startup' | 'Small Business' | 'Organization';
  organizationName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  industry: string;
  years: number;
  responsibilities: string;
  achievements?: string;
}

export type WorkMode = 'online' | 'in-person' | 'hybrid';

export type VerificationStatus = 
  | 'Not Submitted'
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Additional Information Required';

export type PublicationStatus = 'draft' | 'published';

export interface ProfessionalProfile {
  uid: string;
  fullName: string;
  headline: string;
  biography: string;
  profilePhotoUrl: string;
  employmentHistory: WorkExperience[];
  industries: string[];
  skills: string[];
  qualifications: string[];
  experienceYears: number;
  city: string;
  state: string;
  workModes: WorkMode[];
  profileVisibility: 'public' | 'private';
  profileCompletion: number; // 0 to 100
  verificationStatus: VerificationStatus;
  publicationStatus: PublicationStatus;
  featured?: boolean;
  contactPreference?: string;
  ratingAverage?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 
  | 'Finance'
  | 'Engineering'
  | 'Technology'
  | 'Teaching'
  | 'Career Mentoring'
  | 'Human Resources'
  | 'Business Management'
  | 'Project Advisory'
  | 'Training';

export type PricingType = 'hourly' | 'fixed';

export interface Service {
  serviceId: string;
  professionalUid: string;
  title: string;
  description: string;
  category: ServiceCategory;
  pricingType: PricingType;
  hourlyRate?: number;
  fixedPrice?: number;
  duration: string; // e.g., "1 Hour", "2 Hours", "Project-based"
  deliveryModes: WorkMode[];
  activeStatus: boolean;
}

export interface AvailabilitySchedule {
  [dayOfWeek: string]: string[]; // e.g. "Monday": ["09:00 - 11:00", "14:00 - 16:00"]
}

export interface Availability {
  availabilityId: string;
  professionalUid: string;
  weeklySchedule: AvailabilitySchedule;
  blockedDates: string[]; // YYYY-MM-DD format
  timeZone: string; // default 'Asia/Kolkata'
  updatedAt: string;
}

export type BookingStatus = 'Pending' | 'Accepted' | 'Declined' | 'Completed' | 'Cancelled';

export interface Booking {
  bookingId: string;
  clientUid: string;
  clientName: string;
  clientEmail: string;
  professionalUid: string;
  professionalName: string;
  serviceId: string;
  serviceTitle: string;
  requirementDescription: string;
  requestedDate: string; // YYYY-MM-DD
  requestedTime: string; // e.g. "10:00 AM"
  meetingMode: WorkMode;
  location?: string;
  durationHours: number;
  priceEstimate: number;
  status: BookingStatus;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  reviewId: string;
  bookingId: string;
  clientUid: string;
  clientName: string;
  professionalUid: string;
  rating: number; // 1 to 5
  comment: string;
  response?: string;
  publicationStatus: 'published' | 'hidden' | 'flagged';
  createdAt: string;
}

export interface SavedExpert {
  savedExpertId: string;
  clientUid: string;
  professionalUid: string;
  createdAt: string;
}

export interface NotificationItem {
  notificationId: string;
  recipientUid: string;
  title: string;
  message: string;
  type: 'booking' | 'review' | 'verification' | 'system';
  relatedEntityId?: string;
  readAt?: string | null;
  createdAt: string;
}

export interface VerificationSubmission {
  submissionId: string;
  professionalUid: string;
  professionalName: string;
  credentialType: 'Degree / Diploma' | 'Professional License' | 'Govt ID / Pension Proof' | 'Employment Certificate';
  issuingOrganization: string;
  secureDocumentReference: string;
  status: VerificationStatus;
  reviewerNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface PaymentRecord {
  paymentId: string;
  bookingId: string;
  clientUid: string;
  professionalUid: string;
  amount: number;
  currency: 'INR';
  platformFee: number;
  paymentProvider: 'Demo Simulation' | 'Razorpay';
  providerTransactionId: string;
  paymentStatus: 'Not Paid' | 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  createdAt: string;
}

export interface ContentReport {
  reportId: string;
  reporterUid: string;
  reportedEntityId: string;
  reportType: 'review' | 'profile' | 'user';
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}
