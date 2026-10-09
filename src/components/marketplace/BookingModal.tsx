import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { Service, WorkMode, Booking } from '../../types';
import { Calendar, Clock, DollarSign, CheckCircle2, AlertCircle, Video, MapPin } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalUid: string;
  initialServiceId?: string;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  professionalUid,
  initialServiceId,
  onBookingSuccess
}) => {
  const { getProfileByUid, getServicesByUid, createBooking, bookings } = useDatabase();
  const { currentUser, openAuthModal } = useAuth();

  const profile = getProfileByUid(professionalUid);
  const availableServices = getServicesByUid(professionalUid);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || availableServices[0]?.serviceId || ''
  );

  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    } else if (availableServices.length > 0) {
      setSelectedServiceId(availableServices[0].serviceId);
    }
  }, [initialServiceId, availableServices]);

  const selectedService = availableServices.find(s => s.serviceId === selectedServiceId) || availableServices[0];

  // Form State
  const [requirementDescription, setRequirementDescription] = useState('');
  const [requestedDate, setRequestedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [requestedTime, setRequestedTime] = useState('10:00 AM');
  const [meetingMode, setMeetingMode] = useState<WorkMode>('online');
  const [durationHours, setDurationHours] = useState<number>(1);
  const [location, setLocation] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!profile || availableServices.length === 0) return null;

  // Real-time price calculation as specified in Section 10
  const priceEstimate = selectedService
    ? (selectedService.pricingType === 'hourly'
        ? (selectedService.hourlyRate || 2500) * durationHours
        : (selectedService.fixedPrice || 10000))
    : 2500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      onClose();
      openAuthModal('client', 'signin');
      return;
    }

    if (!requirementDescription) {
      setError("Please provide a description of your requirement.");
      return;
    }

    // Date validation
    const targetDate = new Date(requestedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      setError("Requested date cannot be in the past.");
      return;
    }

    // Conflict prevention check for overlapping accepted bookings
    const isConflict = bookings.some(b => 
      b.professionalUid === professionalUid &&
      b.requestedDate === requestedDate &&
      b.requestedTime === requestedTime &&
      b.status === 'Accepted'
    );

    if (isConflict) {
      setError("The selected professional already has an accepted appointment at this time. Please choose another date or time slot.");
      return;
    }

    setLoading(true);

    try {
      const booking = createBooking({
        clientUid: currentUser.uid,
        clientName: currentUser.fullName,
        clientEmail: currentUser.email,
        professionalUid: profile.uid,
        professionalName: profile.fullName,
        serviceId: selectedService.serviceId,
        serviceTitle: selectedService.title,
        requirementDescription,
        requestedDate,
        requestedTime,
        meetingMode,
        location: meetingMode === 'in-person' ? location : undefined,
        durationHours,
        priceEstimate
      });

      setLoading(false);
      onClose();
      onBookingSuccess(booking);
    } catch (err: any) {
      setError(err.message || "Failed to create booking.");
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-4">
        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
          Booking Request Workflow
        </span>
        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
          Request Service with {profile.fullName}
        </h3>
        <p className="text-xs text-slate-500">
          Select your required service, describe your requirement, and choose a preferred time slot.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        
        {/* Service Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Service *</label>
          <select
            value={selectedServiceId}
            onChange={e => setSelectedServiceId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            {availableServices.map(s => (
              <option key={s.serviceId} value={s.serviceId}>
                {s.title} — ₹{(s.hourlyRate || s.fixedPrice || 0).toLocaleString('en-IN')} ({s.pricingType})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Service Detail Box */}
        {selectedService && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <p className="font-bold text-slate-900">{selectedService.title}</p>
            <p className="text-slate-600">{selectedService.description}</p>
          </div>
        )}

        {/* Requirement Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Describe Your Requirement / Context *
          </label>
          <textarea
            required
            rows={3}
            value={requirementDescription}
            onChange={e => setRequirementDescription(e.target.value)}
            placeholder="Explain what project or advisory support you need assistance with..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Date & Time Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Requested Date *</label>
            <input
              type="date"
              required
              value={requestedDate}
              onChange={e => setRequestedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot *</label>
            <select
              value={requestedTime}
              onChange={e => setRequestedTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
            >
              {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Work Mode & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Mode</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMeetingMode('online')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  meetingMode === 'online' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Online Video</span>
              </button>
              <button
                type="button"
                onClick={() => setMeetingMode('in-person')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  meetingMode === 'in-person' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>In-Person</span>
              </button>
            </div>
          </div>

          {selectedService?.pricingType === 'hourly' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Hours)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={durationHours}
                onChange={e => setDurationHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {meetingMode === 'in-person' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Office address or coffee lounge"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        )}

        {/* Automatic Real-time Price Estimation Box */}
        <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 text-slate-900 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Estimated Total Price</span>
            <span className="text-2xl font-extrabold text-teal-700">₹{priceEstimate.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-500 block">
              ({selectedService?.pricingType === 'hourly' ? `₹${selectedService.hourlyRate} × ${durationHours} hr` : 'Fixed Project Package'})
            </span>
          </div>
          <span className="text-[11px] text-slate-500 italic max-w-[160px] text-right">
            Transparent price estimate. No payment is charged until confirmed by professional.
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-lg shadow-teal-600/20 transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </div>

      </form>

    </Modal>
  );
};
