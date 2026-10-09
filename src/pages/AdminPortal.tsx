import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { VerificationBadge } from '../components/common/Badge';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Clock, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Search,
  Eye
} from 'lucide-react';
import { VerificationStatus } from '../types';

export const AdminPortal: React.FC = () => {
  const { verifications, reviewVerification, profiles, bookings, reports } = useDatabase();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'verifications' | 'users' | 'reports'>('verifications');
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500">Only authorized administrators can access this portal.</p>
      </div>
    );
  }

  const pendingVerifs = verifications.filter(v => v.status === 'Pending Review');

  const handleReviewAction = (submissionId: string, status: VerificationStatus) => {
    const notes = reviewerNotes[submissionId] || '';
    reviewVerification(submissionId, status, notes);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-purple-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-800/50">
        <div className="space-y-2">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-widest bg-purple-900 px-3 py-1 rounded-full border border-purple-700">
            Administrative Operations Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white">Platform Administration</h1>
          <p className="text-xs text-purple-200">
            Review credential verification submissions, oversee user accounts, and moderate platform content.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-900/60 border border-purple-700 text-purple-200 text-xs font-bold">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <span>SuperAdmin Identity</span>
        </div>
      </div>

      {/* Real Database Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Total Profiles</span>
          <span className="text-2xl font-extrabold text-slate-900">{profiles.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Pending Verifs</span>
          <span className="text-2xl font-extrabold text-amber-600">{pendingVerifs.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Total Bookings</span>
          <span className="text-2xl font-extrabold text-teal-700">{bookings.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Verified Experts</span>
          <span className="text-2xl font-extrabold text-emerald-600">
            {profiles.filter(p => p.verificationStatus === 'Approved').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Active Services</span>
          <span className="text-2xl font-extrabold text-slate-900">
            {profiles.length * 2}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Content Reports</span>
          <span className="text-2xl font-extrabold text-purple-700">{reports.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-3 px-6 font-bold text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'verifications'
              ? 'text-purple-700 border-b-2 border-purple-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Queue ({pendingVerifs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-6 font-bold text-sm transition-colors relative flex items-center gap-2 ${
            activeTab === 'users'
              ? 'text-purple-700 border-b-2 border-purple-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Professional Directory ({profiles.length})</span>
        </button>
      </div>

      {/* Verifications Queue */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">Credential Verification Queue</h2>
          
          {verifications.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs italic">
              No credential submissions in queue.
            </div>
          ) : (
            <div className="space-y-4">
              {verifications.map(v => (
                <div key={v.submissionId} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{v.professionalName}</span>
                        <VerificationBadge status={v.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Credential: <strong className="text-slate-800">{v.credentialType}</strong> • Issuer: {v.issuingOrganization}
                      </p>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Submitted: {new Date(v.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Document Reference preview */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-purple-600" />
                      {v.secureDocumentReference}
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                      Secure Storage Object
                    </span>
                  </div>

                  {/* Action Controls */}
                  {v.status === 'Pending Review' && (
                    <div className="space-y-3 pt-2">
                      <input
                        type="text"
                        placeholder="Add optional reviewer notes or request details..."
                        value={reviewerNotes[v.submissionId] || ''}
                        onChange={e => setReviewerNotes({ ...reviewerNotes, [v.submissionId]: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleReviewAction(v.submissionId, 'Rejected')}
                          className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs"
                        >
                          Reject Submission
                        </button>
                        <button
                          onClick={() => handleReviewAction(v.submissionId, 'Additional Information Required')}
                          className="px-4 py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-xs"
                        >
                          Request Info
                        </button>
                        <button
                          onClick={() => handleReviewAction(v.submissionId, 'Approved')}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                        >
                          Approve & Issue Badge
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Directory Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {profiles.map(p => (
            <div key={p.uid} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <img src={p.profilePhotoUrl} alt={p.fullName} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{p.fullName}</h4>
                  <p className="text-[11px] text-slate-500">{p.headline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <VerificationBadge status={p.verificationStatus} />
                <span className="font-semibold text-slate-700">{p.experienceYears} Yrs Exp</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
