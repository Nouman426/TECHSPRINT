import React from 'react';
import { Modal } from '../common/Modal';
import { Booking } from '../../types';
import { CheckCircle2, Calendar, Clock, DollarSign, ArrowRight } from 'lucide-react';

interface BookingConfirmationModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onViewDashboard: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  isOpen,
  onClose,
  onViewDashboard
}) => {
  if (!booking || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      
      <div className="text-center space-y-4 py-2 font-sans">
        
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center font-bold animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-widest">
            Booking Submitted
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            Request Sent to {booking.professionalName}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Reference ID: <strong className="text-slate-800 font-mono">{booking.bookingId.toUpperCase()}</strong>
          </p>
        </div>

        {/* Confirmation Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Service:</span>
            <span className="font-bold text-slate-900">{booking.serviceTitle}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Requested Date & Time:</span>
            <span className="font-semibold text-slate-800">{booking.requestedDate} at {booking.requestedTime}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Meeting Mode:</span>
            <span className="font-semibold text-slate-800 capitalize">{booking.meetingMode}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="font-bold text-slate-700">Estimated Total:</span>
            <span className="font-extrabold text-teal-700 text-sm">₹{booking.priceEstimate.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          The professional will review your booking request. You will receive an in-app notification once the status is updated to <strong>Accepted</strong>.
        </p>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            Close Window
          </button>
          <button
            onClick={() => { onClose(); onViewDashboard(); }}
            className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Client Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </Modal>
  );
};
