import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

interface TermsPrivacyProps {
  initialTab?: 'terms' | 'privacy';
}

export const TermsPrivacy: React.FC<TermsPrivacyProps> = ({ initialTab = 'terms' }) => {
  const [tab, setTab] = useState<'terms' | 'privacy'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      
      {/* Draft Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">DRAFT LEGAL DOCUMENTATION</h4>
          <p className="mt-0.5 leading-relaxed">
            These Terms of Service and Privacy Policy are draft documents generated for the VETEREN College Hackathon MVP. They require formal legal review before commercial deployment.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setTab('terms')}
          className={`pb-3 px-6 font-bold text-sm transition-colors relative ${
            tab === 'terms'
              ? 'text-teal-700 border-b-2 border-teal-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Draft Terms of Service
        </button>
        <button
          onClick={() => setTab('privacy')}
          className={`pb-3 px-6 font-bold text-sm transition-colors relative ${
            tab === 'privacy'
              ? 'text-teal-700 border-b-2 border-teal-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Draft Privacy Policy
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs leading-relaxed">
        {tab === 'terms' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">VETEREN — Draft Terms of Service</h2>
            <p className="text-slate-500 text-[11px]">Last Updated: March 2026 (Hackathon Draft)</p>
            
            <h3 className="font-bold text-slate-900 text-sm">1. Acceptance of Terms</h3>
            <p>By registering or using VETEREN ("the Platform"), users agree to comply with these Terms of Service. VETEREN acts as a marketplace platform connecting clients with independent retired professionals and experts.</p>

            <h3 className="font-bold text-slate-900 text-sm">2. Verification & Credential Accuracy</h3>
            <p>Professionals warrant that all submitted credentials, degrees, employment history, and certifications are genuine. Falsifying qualifications will result in immediate profile suspension.</p>

            <h3 className="font-bold text-slate-900 text-sm">3. Booking & Payment Terms</h3>
            <p>All price estimates are provided transparently in INR (₹). Simulated demo checkouts do not constitute real financial transactions unless integrated with authorized payment gateways.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">VETEREN — Draft Privacy Policy</h2>
            <p className="text-slate-500 text-[11px]">Last Updated: March 2026 (Hackathon Draft)</p>

            <h3 className="font-bold text-slate-900 text-sm">1. Data Collection & Protection</h3>
            <p>We respect your privacy. Private contact details (phone numbers, full addresses) are never publicly exposed on expert profile cards without explicit authorization.</p>

            <h3 className="font-bold text-slate-900 text-sm">2. Document Storage Security</h3>
            <p>Verification documents uploaded by professionals are restricted to secure Firestore/Storage access rules and can only be inspected by authorized administrators.</p>
          </div>
        )}
      </div>

    </div>
  );
};
