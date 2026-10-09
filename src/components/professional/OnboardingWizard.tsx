import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Eye, 
  Save, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Upload,
  Sparkles
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import { ServiceManager } from './ServiceManager';
import { AvailabilityManager } from './AvailabilityManager';
import { VerificationBadge } from '../common/Badge';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { currentUser } = useAuth();
  const { getProfileByUid, saveProfile, submitVerification, verifications } = useDatabase();

  const existingProfile = currentUser ? getProfileByUid(currentUser.uid) : null;
  const userVerif = verifications.find(v => v.professionalUid === currentUser?.uid);

  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState(existingProfile?.fullName || currentUser?.fullName || '');
  const [photoUrl, setPhotoUrl] = useState(existingProfile?.profilePhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80');
  const [city, setCity] = useState(existingProfile?.city || 'Mumbai');
  const [state, setState] = useState(existingProfile?.state || 'Maharashtra');
  const [biography, setBiography] = useState(existingProfile?.biography || '');
  const [headline, setHeadline] = useState(existingProfile?.headline || '');

  // Step 2 Work History
  const [jobTitle, setJobTitle] = useState(existingProfile?.employmentHistory?.[0]?.jobTitle || '');
  const [company, setCompany] = useState(existingProfile?.employmentHistory?.[0]?.company || '');
  const [experienceYears, setExperienceYears] = useState(existingProfile?.experienceYears || 25);
  const [skillsText, setSkillsText] = useState(existingProfile?.skills?.join(', ') || 'Financial Strategy, SME Audits, Treasury Management');
  const [qualificationsText, setQualificationsText] = useState(existingProfile?.qualifications?.join(', ') || 'Chartered Accountant (ICAI), B.Com');

  // Step 5 Verification
  const [credentialType, setCredentialType] = useState<'Degree / Diploma' | 'Professional License' | 'Govt ID / Pension Proof' | 'Employment Certificate'>('Professional License');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [fileName, setFileName] = useState('');
  const [isVerifSubmitted, setIsVerifSubmitted] = useState(Boolean(userVerif));

  const steps = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Work Experience', icon: Briefcase },
    { num: 3, title: 'Services', icon: Layers },
    { num: 4, title: 'Availability', icon: Calendar },
    { num: 5, title: 'Verification', icon: ShieldCheck },
    { num: 6, title: 'Publish', icon: Eye },
  ];

  const handleSaveDraft = () => {
    if (!currentUser) return;
    saveProfile({
      uid: currentUser.uid,
      fullName,
      headline: headline || 'Senior Experienced Consultant',
      biography,
      profilePhotoUrl: photoUrl,
      city,
      state,
      experienceYears,
      skills: skillsText.split(',').map(s => s.trim()).filter(Boolean),
      qualifications: qualificationsText.split(',').map(q => q.trim()).filter(Boolean),
      employmentHistory: [
        {
          id: 'w-1',
          jobTitle: jobTitle || 'Senior Director',
          company: company || 'Corporate Group',
          industry: 'Consulting',
          years: experienceYears,
          responsibilities: 'Executive advisory and project supervision.'
        }
      ],
      publicationStatus: 'draft',
      profileCompletion: 60
    });
  };

  const handlePublish = () => {
    if (!currentUser) return;
    handleSaveDraft();
    saveProfile({
      uid: currentUser.uid,
      publicationStatus: 'published',
      profileCompletion: 100
    });
    onComplete();
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !issuingOrg) return;

    submitVerification({
      professionalUid: currentUser.uid,
      professionalName: fullName,
      credentialType,
      issuingOrganization: issuingOrg,
      secureDocumentReference: fileName || 'Credential_Document_Proof.pdf'
    });
    setIsVerifSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden font-sans">
      
      {/* Wizard Header Progress Bar */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Professional Setup</span>
            <h2 className="text-xl font-extrabold text-white">Complete Your Expert Profile</h2>
          </div>
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-teal-400" />
            <span>Save Draft</span>
          </button>
        </div>

        {/* Step Numbers Indicator */}
        <div className="grid grid-cols-6 gap-2">
          {steps.map(s => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : isCompleted
                    ? 'bg-slate-800 text-teal-400'
                    : 'bg-slate-800/50 text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-extrabold text-lg text-slate-900">Step 1: Personal Information</h3>
            <p className="text-xs text-slate-500">Public profile details visible to potential clients.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Headline *</label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="e.g. Retired CFO & Financial Advisor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Photo URL</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Biography *</label>
              <textarea
                rows={4}
                value={biography}
                onChange={e => setBiography(e.target.value)}
                placeholder="Share your career highlights, domain achievements, and consulting approach..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Work Experience & Credentials */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-extrabold text-lg text-slate-900">Step 2: Work Experience & Skills</h3>
            <p className="text-xs text-slate-500">Highlight your executive background and core skills.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Latest Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Chief Financial Officer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Bharat Heavy Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Years Experience</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={e => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skillsText}
                onChange={e => setSkillsText(e.target.value)}
                placeholder="Cash Flow, Audits, Financial Modeling, Capital Budgeting"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications & Degrees (comma separated)</label>
              <input
                type="text"
                value={qualificationsText}
                onChange={e => setQualificationsText(e.target.value)}
                placeholder="Chartered Accountant (ICAI), MBA Finance"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {step === 3 && currentUser && (
          <div className="animate-in fade-in duration-200">
            <ServiceManager professionalUid={currentUser.uid} />
          </div>
        )}

        {/* Step 4: Availability */}
        {step === 4 && currentUser && (
          <div className="animate-in fade-in duration-200">
            <AvailabilityManager professionalUid={currentUser.uid} />
          </div>
        )}

        {/* Step 5: Verification Submission */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-extrabold text-lg text-slate-900">Step 5: Credential Verification</h3>
            <p className="text-xs text-slate-500">Submit your degree or license for administrative verification badge issuance.</p>

            {isVerifSubmitted || userVerif ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Credential Verification Submitted</span>
                </div>
                <p className="text-xs">Your credentials have been logged for administrative review. Status: <strong>{userVerif?.status || 'Pending Review'}</strong></p>
              </div>
            ) : (
              <form onSubmit={handleVerificationSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Credential Type</label>
                    <select
                      value={credentialType}
                      onChange={e => setCredentialType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                    >
                      <option value="Professional License">Professional License (ICAI, Bar Council, etc.)</option>
                      <option value="Degree / Diploma">Degree / University Diploma</option>
                      <option value="Govt ID / Pension Proof">Govt Senior Proof / Pension ID</option>
                      <option value="Employment Certificate">Past Employment Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Organization *</label>
                    <input
                      type="text"
                      required
                      value={issuingOrg}
                      onChange={e => setIssuingOrg(e.target.value)}
                      placeholder="e.g. ICAI, BITS Pilani, Govt Authority"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document File Reference</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={fileName}
                      onChange={e => setFileName(e.target.value)}
                      placeholder="Upload simulation (e.g. Degree_Certificate.pdf)"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setFileName(`Verification_Proof_${Date.now()}.pdf`)}
                      className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Attach
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Submit for Review
                </button>
              </form>
            )}
          </div>
        )}

        {/* Step 6: Preview & Publication */}
        {step === 6 && (
          <div className="space-y-6 text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl mx-auto flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Ready to Publish Your Profile!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your professional profile details have been saved. Click "Publish Profile" to make your services publicly visible on VETEREN.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 max-w-lg mx-auto text-xs">
              <p><strong>Name:</strong> {fullName}</p>
              <p><strong>Headline:</strong> {headline}</p>
              <p><strong>Location:</strong> {city}, {state}</p>
              <p><strong>Experience:</strong> {experienceYears} Years</p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={handleSaveDraft}
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Keep as Draft
              </button>
              <button
                onClick={handlePublish}
                className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-lg shadow-teal-600/20 transition-all hover:scale-105"
              >
                Publish Profile Now
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-bold text-slate-400">Step {step} of 6</span>

          <button
            onClick={() => { handleSaveDraft(); setStep(Math.min(6, step + 1)); }}
            disabled={step === 6}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-40"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
