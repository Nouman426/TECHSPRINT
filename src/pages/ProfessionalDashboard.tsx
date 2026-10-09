import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { VerificationBadge, WorkModeBadge } from '../components/common/Badge';
import { RatingStars } from '../components/common/RatingStars';
import { OnboardingWizard } from '../components/professional/OnboardingWizard';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  DollarSign, 
  Star, 
  Edit3, 
  ShieldCheck, 
  TrendingUp, 
  Briefcase,
  AlertCircle,
  Eye,
  UserCheck
} from 'lucide-react';
import { BookingStatus } from '../types';

interface ProfessionalDashboardProps {
  openExpertDetail: (profileUid: string) => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ openExpertDetail }) => {
  const { currentUser } = useAuth();
  const { getProfileByUid, getUserBookings, updateBookingStatus, getProfileReviews, verifications } = useDatabase();

  const [isEditingWizard, setIsEditingWizard] = useState(false);

  if (!currentUser) return null;

  const profile = getProfileByUid(currentUser.uid);
  const bookings = getUserBookings(currentUser.uid, 'professional');
  const reviews = getProfileReviews(currentUser.uid);
  const userVerif = verifications.find(v => v.professionalUid === currentUser.uid);

  // Filter bookings by status
  const pendingRequests = bookings.filter(b => b.status === 'Pending');
  const acceptedAppointments = bookings.filter(b => b.status === 'Accepted');
  const completedServices = bookings.filter(b => b.status === 'Completed');

  // Earnings calculations (INR ₹)
  const totalRevenue = completedServices.reduce((sum, b) => sum + b.priceEstimate, 0);
  const platformFee = Math.round(totalRevenue * 0.10); // 10% platform commission
  const netEarnings = totalRevenue - platformFee;

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status);
  };

  if (isEditingWizard) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <button
          onClick={() => setIsEditingWizard(false)}
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          ← Return to Dashboard Overview
        </button>
        <OnboardingWizard onComplete={() => setIsEditingWizard(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Welcome Banner & Completion Widget */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Professional Advisor Portal
            </span>
            <VerificationBadge status={profile?.verificationStatus || 'Not Submitted'} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome, {currentUser.fullName}!</h1>
          <p className="text-xs text-slate-300 max-w-lg">
            Manage your service availability, respond to client booking requests, and review earnings.
          </p>
        </div>

        <div className="flex items-center gap-4 z-10 shrink-0">
          {/* Completion meter */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Profile Completion</span>
            <span className="text-xl font-extrabold text-teal-400">{profile?.profileCompletion || 60}%</span>
          </div>

          <button
            onClick={() => setIsEditingWizard(true)}
            className="px-5 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile & Services</span>
          </button>
        </div>

      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{pendingRequests.length}</span>
          <p className="text-[11px] text-slate-400">Awaiting your response</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Upcoming Sessions</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{acceptedAppointments.length}</span>
          <p className="text-[11px] text-slate-400">Accepted appointments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Net Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-teal-700">₹{netEarnings.toLocaleString('en-IN')}</span>
          <p className="text-[11px] text-slate-400">After 10% platform fee</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">
            {profile?.ratingAverage ? profile.ratingAverage.toFixed(1) : '5.0'}
          </span>
          <p className="text-[11px] text-slate-400">From {reviews.length} client reviews</p>
        </div>

      </div>

      {/* Main Grid: Pending Booking Requests & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Pending Requests & Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Requests */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>New Booking Requests</span>
              </h3>
              <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {pendingRequests.length} Action Needed
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs italic">
                No pending booking requests at this time.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(req => (
                  <div key={req.bookingId} className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{req.serviceTitle}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Client: <strong>{req.clientName}</strong> ({req.clientEmail})
                        </p>
                      </div>
                      <span className="text-sm font-extrabold text-teal-700">₹{req.priceEstimate.toLocaleString('en-IN')}</span>
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                      "{req.requirementDescription}"
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Requested: <strong>{req.requestedDate} at {req.requestedTime}</strong> ({req.meetingMode})</span>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(req.bookingId, 'Declined')}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleStatusChange(req.bookingId, 'Accepted')}
                          className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm"
                        >
                          Accept Request
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Accepted Sessions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Upcoming Appointments</span>
            </h3>

            {acceptedAppointments.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs italic">
                No upcoming accepted appointments.
              </div>
            ) : (
              <div className="space-y-3">
                {acceptedAppointments.map(app => (
                  <div key={app.bookingId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{app.serviceTitle}</h4>
                      <p className="text-[11px] text-slate-500">Client: {app.clientName} • {app.requestedDate} at {app.requestedTime}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-teal-100 text-teal-800 text-xs font-bold">
                      Accepted
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Earnings Summary & Recent Reviews */}
        <div className="space-y-8">
          
          {/* Earnings Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Earnings Summary</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Completed Services ({completedServices.length})</span>
                <span className="font-bold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Commission (10%)</span>
                <span className="text-slate-500">-₹{platformFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm">
                <span className="text-slate-900">Net Payable Earnings</span>
                <span className="text-teal-700">₹{netEarnings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Payouts processed weekly to registered bank account.
            </p>
          </div>

          {/* Published Reviews */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Client Reviews ({reviews.length})</span>
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews received yet.</p>
            ) : (
              <div className="space-y-3 divide-y divide-slate-100">
                {reviews.map(r => (
                  <div key={r.reviewId} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-900">{r.clientName}</span>
                      <RatingStars rating={r.rating} size={12} showValue={false} />
                    </div>
                    <p className="text-[11px] text-slate-600 italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
