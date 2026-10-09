import React from 'react';
import { UserCheck, Briefcase, ShieldCheck, Calendar, DollarSign, Star, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  openAuthModal: (role: 'professional' | 'client', mode: 'signin' | 'signup') => void;
  setActiveTab: (tab: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ openAuthModal, setActiveTab }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold text-teal-600 uppercase tracking-widest bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
          Platform Architecture & Journey
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          How VETEREN Empowers Knowledge Transfer
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Designed specifically to help retired senior executives, educators, and engineers remain active, earn income, and guide the next generation.
        </p>
      </div>

      {/* Professional Journey Detailed Steps */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">The Professional Journey</h2>
            <p className="text-xs text-slate-500">From account registration to delivering advisory and earning revenue.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1. Register Account', desc: 'Create a Professional account with your email and basic details.' },
            { step: '2. Profile Setup', desc: 'Complete our 6-step progressive wizard with work history and skills.' },
            { step: '3. Credentials Review', desc: 'Submit degrees or licenses for administrative verification.' },
            { step: '4. Publish & Earn', desc: 'Define your services, set hourly rates (₹), accept bookings, and mentor clients.' },
          ].map((s, idx) => (
            <div key={s.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 relative">
              <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">Step {idx + 1}</span>
              <h3 className="font-bold text-sm text-slate-900 mt-2">{s.step}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => openAuthModal('professional', 'signup')}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Create Your Professional Profile Now
          </button>
        </div>
      </div>

      {/* Client Journey Detailed Steps */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">The Client & Business Journey</h2>
            <p className="text-xs text-slate-500">Discovering, booking, and receiving expert consultation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1. Discover Experts', desc: 'Filter by category, experience, rate, or ask Gemini AI.' },
            { step: '2. Compare Profiles', desc: 'Review verified employment history, pricing, and client ratings.' },
            { step: '3. Request Booking', desc: 'Select date & slot with automatic transparent price calculation.' },
            { step: '4. Session & Review', desc: 'Attend session and publish a genuine review after completion.' },
          ].map((s, idx) => (
            <div key={s.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Step {idx + 1}</span>
              <h3 className="font-bold text-sm text-slate-900 mt-2">{s.step}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => setActiveTab('experts')}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
          >
            Find Experts Marketplace
          </button>
        </div>
      </div>

    </div>
  );
};
