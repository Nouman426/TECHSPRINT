import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ProfessionalProfile, 
  Service, 
  Availability, 
  Booking, 
  Review, 
  SavedExpert, 
  NotificationItem, 
  VerificationSubmission,
  ContentReport,
  BookingStatus,
  VerificationStatus
} from '../types';
import { 
  INITIAL_MOCK_PROFILES, 
  INITIAL_MOCK_SERVICES, 
  INITIAL_MOCK_AVAILABILITY, 
  INITIAL_MOCK_REVIEWS 
} from '../services/mockData';

interface DatabaseContextType {
  profiles: ProfessionalProfile[];
  services: Service[];
  availabilities: Availability[];
  bookings: Booking[];
  reviews: Review[];
  savedExperts: SavedExpert[];
  notifications: NotificationItem[];
  verifications: VerificationSubmission[];
  reports: ContentReport[];

  // Profile actions
  getProfileByUid: (uid: string) => ProfessionalProfile | undefined;
  saveProfile: (profile: Partial<ProfessionalProfile> & { uid: string }) => void;
  
  // Service actions
  getServicesByUid: (uid: string) => Service[];
  addService: (service: Omit<Service, 'serviceId'>) => Service;
  updateService: (serviceId: string, updates: Partial<Service>) => void;
  deleteService: (serviceId: string) => void;

  // Booking actions
  createBooking: (bookingData: Omit<Booking, 'bookingId' | 'createdAt' | 'updatedAt' | 'status'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, reason?: string) => void;
  getUserBookings: (uid: string, role: 'client' | 'professional') => Booking[];

  // Saved Experts
  toggleSaveExpert: (clientUid: string, professionalUid: string) => boolean;
  isExpertSaved: (clientUid: string, professionalUid: string) => boolean;

  // Reviews
  addReview: (reviewData: Omit<Review, 'reviewId' | 'createdAt' | 'publicationStatus'>) => Review;
  getProfileReviews: (professionalUid: string) => Review[];

  // Verification
  submitVerification: (submission: Omit<VerificationSubmission, 'submissionId' | 'submittedAt' | 'status'>) => void;
  reviewVerification: (submissionId: string, status: VerificationStatus, notes?: string) => void;

  // Admin / Reports
  reportContent: (reporterUid: string, reportedEntityId: string, type: 'review' | 'profile' | 'user', reason: string) => void;

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;

  // Utility
  resetDemoData: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>(() => {
    const saved = localStorage.getItem('veteren_db_profiles');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_PROFILES;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('veteren_db_services');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_SERVICES;
  });

  const [availabilities, setAvailabilities] = useState<Availability[]>(() => {
    const saved = localStorage.getItem('veteren_db_availabilities');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_AVAILABILITY;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('veteren_db_bookings');
    if (saved) return JSON.parse(saved);
    // Initial sample booking for demo client
    return [
      {
        bookingId: 'bk-completed-1',
        clientUid: 'client-demo',
        clientName: 'Priya Verma',
        clientEmail: 'client@veteren.example',
        professionalUid: 'prof-1',
        professionalName: 'Ramesh Sharma',
        serviceId: 's-1',
        serviceTitle: 'SME Financial Health & Cash Flow Advisory',
        requirementDescription: 'Need cash flow strategy and operational working capital advice for Verma Tech.',
        requestedDate: '2026-02-25',
        requestedTime: '10:00 AM',
        meetingMode: 'online',
        durationHours: 1,
        priceEstimate: 2500,
        status: 'Completed',
        createdAt: '2026-02-24T09:00:00Z',
        updatedAt: '2026-02-25T11:00:00Z'
      }
    ];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('veteren_db_reviews');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_REVIEWS;
  });

  const [savedExperts, setSavedExperts] = useState<SavedExpert[]>(() => {
    const saved = localStorage.getItem('veteren_db_saved_experts');
    return saved ? JSON.parse(saved) : [{ savedExpertId: 'se-1', clientUid: 'client-demo', professionalUid: 'prof-1', createdAt: '2026-02-20T10:00:00Z' }];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('veteren_db_notifications');
    return saved ? JSON.parse(saved) : [
      {
        notificationId: 'notif-1',
        recipientUid: 'client-demo',
        title: 'Booking Completed',
        message: 'Your session with Ramesh Sharma was completed. Leave a review now!',
        type: 'booking',
        relatedEntityId: 'bk-completed-1',
        readAt: null,
        createdAt: '2026-02-25T11:05:00Z'
      }
    ];
  });

  const [verifications, setVerifications] = useState<VerificationSubmission[]>(() => {
    const saved = localStorage.getItem('veteren_db_verifications');
    return saved ? JSON.parse(saved) : [
      {
        submissionId: 'ver-1',
        professionalUid: 'prof-1',
        professionalName: 'Ramesh Sharma',
        credentialType: 'Professional License',
        issuingOrganization: 'Institute of Chartered Accountants of India (ICAI)',
        secureDocumentReference: 'ICAI_FCA_Certificate_9842.pdf',
        status: 'Approved',
        submittedAt: '2026-01-16T12:00:00Z',
        reviewedAt: '2026-01-17T09:30:00Z'
      },
      {
        submissionId: 'ver-2',
        professionalUid: 'prof-3',
        professionalName: 'Vikram Mehta',
        credentialType: 'Degree / Diploma',
        issuingOrganization: 'BITS Pilani Structural Engineering Board',
        secureDocumentReference: 'BITS_BE_Civil_Degree.pdf',
        status: 'Pending Review',
        submittedAt: '2026-03-02T15:00:00Z'
      }
    ];
  });

  const [reports, setReports] = useState<ContentReport[]>(() => {
    const saved = localStorage.getItem('veteren_db_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state changes to localStorage
  useEffect(() => { localStorage.setItem('veteren_db_profiles', JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { localStorage.setItem('veteren_db_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('veteren_db_availabilities', JSON.stringify(availabilities)); }, [availabilities]);
  useEffect(() => { localStorage.setItem('veteren_db_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('veteren_db_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('veteren_db_saved_experts', JSON.stringify(savedExperts)); }, [savedExperts]);
  useEffect(() => { localStorage.setItem('veteren_db_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('veteren_db_verifications', JSON.stringify(verifications)); }, [verifications]);
  useEffect(() => { localStorage.setItem('veteren_db_reports', JSON.stringify(reports)); }, [reports]);

  // Actions implementation
  const getProfileByUid = (uid: string) => profiles.find(p => p.uid === uid);

  const saveProfile = (updatedData: Partial<ProfessionalProfile> & { uid: string }) => {
    setProfiles(prev => {
      const idx = prev.findIndex(p => p.uid === updatedData.uid);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...updatedData, updatedAt: new Date().toISOString() };
        return copy;
      } else {
        const newProf: ProfessionalProfile = {
          fullName: 'Professional Expert',
          headline: 'Experienced Specialist',
          biography: '',
          profilePhotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
          employmentHistory: [],
          industries: ['Consulting'],
          skills: [],
          qualifications: [],
          experienceYears: 20,
          city: 'Mumbai',
          state: 'Maharashtra',
          workModes: ['online'],
          profileVisibility: 'public',
          profileCompletion: 80,
          verificationStatus: 'Not Submitted',
          publicationStatus: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...updatedData,
          uid: updatedData.uid
        };
        return [...prev, newProf];
      }
    });
  };

  const getServicesByUid = (uid: string) => services.filter(s => s.professionalUid === uid && s.activeStatus);

  const addService = (serviceData: Omit<Service, 'serviceId'>): Service => {
    const newService: Service = {
      ...serviceData,
      serviceId: 's-' + Date.now()
    };
    setServices(prev => [...prev, newService]);
    return newService;
  };

  const updateService = (serviceId: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.serviceId === serviceId ? { ...s, ...updates } : s));
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.serviceId !== serviceId));
  };

  const createBooking = (data: Omit<Booking, 'bookingId' | 'createdAt' | 'updatedAt' | 'status'>): Booking => {
    const newBooking: Booking = {
      ...data,
      bookingId: 'bk-' + Date.now(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBookings(prev => [newBooking, ...prev]);

    // Push in-app notification to Professional
    const notif: NotificationItem = {
      notificationId: 'notif-' + Date.now(),
      recipientUid: data.professionalUid,
      title: 'New Booking Request',
      message: `${data.clientName} requested "${data.serviceTitle}" for ${data.requestedDate} at ${data.requestedTime}.`,
      type: 'booking',
      relatedEntityId: newBooking.bookingId,
      readAt: null,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, reason?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.bookingId === bookingId) {
        const updated = { ...b, status, cancellationReason: reason, updatedAt: new Date().toISOString() };
        
        // Notify client on status change
        const targetRecipient = status === 'Accepted' || status === 'Declined' ? b.clientUid : b.professionalUid;
        const notif: NotificationItem = {
          notificationId: 'notif-' + Date.now(),
          recipientUid: targetRecipient,
          title: `Booking ${status}`,
          message: `Your booking for "${b.serviceTitle}" has been marked as ${status}.`,
          type: 'booking',
          relatedEntityId: b.bookingId,
          readAt: null,
          createdAt: new Date().toISOString()
        };
        setNotifications(curr => [notif, ...curr]);

        return updated;
      }
      return b;
    }));
  };

  const getUserBookings = (uid: string, role: 'client' | 'professional') => {
    return bookings.filter(b => role === 'client' ? b.clientUid === uid : b.professionalUid === uid);
  };

  const toggleSaveExpert = (clientUid: string, professionalUid: string): boolean => {
    let isSavedNow = false;
    setSavedExperts(prev => {
      const existingIndex = prev.findIndex(se => se.clientUid === clientUid && se.professionalUid === professionalUid);
      if (existingIndex >= 0) {
        isSavedNow = false;
        return prev.filter((_, idx) => idx !== existingIndex);
      } else {
        isSavedNow = true;
        return [...prev, { savedExpertId: 'se-' + Date.now(), clientUid, professionalUid, createdAt: new Date().toISOString() }];
      }
    });
    return isSavedNow;
  };

  const isExpertSaved = (clientUid: string, professionalUid: string) => {
    return savedExperts.some(se => se.clientUid === clientUid && se.professionalUid === professionalUid);
  };

  const addReview = (reviewData: Omit<Review, 'reviewId' | 'createdAt' | 'publicationStatus'>): Review => {
    const newRev: Review = {
      ...reviewData,
      reviewId: 'rev-' + Date.now(),
      publicationStatus: 'published',
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate rating average for the professional
    const profReviews = [...reviews.filter(r => r.professionalUid === reviewData.professionalUid), newRev];
    const avg = profReviews.reduce((sum, r) => sum + r.rating, 0) / profReviews.length;
    
    setProfiles(prev => prev.map(p => {
      if (p.uid === reviewData.professionalUid) {
        return {
          ...p,
          ratingAverage: Math.round(avg * 10) / 10,
          reviewCount: profReviews.length
        };
      }
      return p;
    }));

    return newRev;
  };

  const getProfileReviews = (professionalUid: string) => {
    return reviews.filter(r => r.professionalUid === professionalUid && r.publicationStatus === 'published');
  };

  const submitVerification = (submission: Omit<VerificationSubmission, 'submissionId' | 'submittedAt' | 'status'>) => {
    const newSub: VerificationSubmission = {
      ...submission,
      submissionId: 'ver-' + Date.now(),
      status: 'Pending Review',
      submittedAt: new Date().toISOString()
    };
    setVerifications(prev => [newSub, ...prev]);
    
    // Update profile verification status
    saveProfile({ uid: submission.professionalUid, verificationStatus: 'Pending Review' });
  };

  const reviewVerification = (submissionId: string, status: VerificationStatus, notes?: string) => {
    setVerifications(prev => prev.map(v => {
      if (v.submissionId === submissionId) {
        const updated = { ...v, status, reviewerNotes: notes, reviewedAt: new Date().toISOString() };
        saveProfile({ uid: v.professionalUid, verificationStatus: status });
        
        // Notify professional
        const notif: NotificationItem = {
          notificationId: 'notif-' + Date.now(),
          recipientUid: v.professionalUid,
          title: 'Verification Update',
          message: `Your credential verification has been ${status}. ${notes ? `Notes: ${notes}` : ''}`,
          type: 'verification',
          readAt: null,
          createdAt: new Date().toISOString()
        };
        setNotifications(curr => [notif, ...curr]);

        return updated;
      }
      return v;
    }));
  };

  const reportContent = (reporterUid: string, reportedEntityId: string, type: 'review' | 'profile' | 'user', reason: string) => {
    const newReport: ContentReport = {
      reportId: 'rep-' + Date.now(),
      reporterUid,
      reportedEntityId,
      reportType: type,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.notificationId === notificationId ? { ...n, readAt: new Date().toISOString() } : n));
  };

  const resetDemoData = () => {
    localStorage.removeItem('veteren_db_profiles');
    localStorage.removeItem('veteren_db_services');
    localStorage.removeItem('veteren_db_availabilities');
    localStorage.removeItem('veteren_db_bookings');
    localStorage.removeItem('veteren_db_reviews');
    localStorage.removeItem('veteren_db_saved_experts');
    localStorage.removeItem('veteren_db_notifications');
    localStorage.removeItem('veteren_db_verifications');
    localStorage.removeItem('veteren_db_reports');

    setProfiles(INITIAL_MOCK_PROFILES);
    setServices(INITIAL_MOCK_SERVICES);
    setAvailabilities(INITIAL_MOCK_AVAILABILITY);
    setReviews(INITIAL_MOCK_REVIEWS);
    setBookings([]);
    setSavedExperts([]);
    setNotifications([]);
    setVerifications([]);
    setReports([]);
  };

  return (
    <DatabaseContext.Provider value={{
      profiles,
      services,
      availabilities,
      bookings,
      reviews,
      savedExperts,
      notifications,
      verifications,
      reports,
      getProfileByUid,
      saveProfile,
      getServicesByUid,
      addService,
      updateService,
      deleteService,
      createBooking,
      updateBookingStatus,
      getUserBookings,
      toggleSaveExpert,
      isExpertSaved,
      addReview,
      getProfileReviews,
      submitVerification,
      reviewVerification,
      reportContent,
      markNotificationAsRead,
      resetDemoData
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
};
