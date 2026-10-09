import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { VerificationStatus } from '../../types';

export const VerificationBadge: React.FC<{ status: VerificationStatus; showText?: boolean }> = ({ 
  status, 
  showText = true 
}) => {
  if (status === 'Approved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
        {showText && <span>Verified Expert</span>}
      </span>
    );
  }

  if (status === 'Pending Review') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        {showText && <span>Verification Pending</span>}
      </span>
    );
  }

  if (status === 'Additional Information Required') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
        {showText && <span>Info Requested</span>}
      </span>
    );
  }

  return null;
};

export const WorkModeBadge: React.FC<{ mode: 'online' | 'in-person' | 'hybrid' }> = ({ mode }) => {
  const styles = {
    'online': 'bg-sky-50 text-sky-700 border-sky-200',
    'in-person': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'hybrid': 'bg-teal-50 text-teal-700 border-teal-200'
  };

  const labels = {
    'online': 'Online',
    'in-person': 'In-Person',
    'hybrid': 'Hybrid (Online/In-Person)'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[mode]}`}>
      {labels[mode]}
    </span>
  );
};
