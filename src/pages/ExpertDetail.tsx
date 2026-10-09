import React from 'react';
import { 
  MapPin, 
  Briefcase, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  MessageSquare,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { VerificationBadge, WorkModeBadge } from '../components/common/Badge';
import { RatingStars } from '../components/common/RatingStars';

interface ExpertDetailProps {
  profileUid: string;
  onBack: () => void;
  openBooking: (profileUid: string, serviceId?: string) => void;
}

export const ExpertDetail: React.FC<ExpertDetailProps> = ({ profileUid, onBack, openBooking }) => {
  const { getProfileByUid, getServicesByUid, getProfileReviews, toggleSaveExpert, isExpertSaved, availabilities } = useDatabase();
  const { currentUser, openAuthModal } = useAuth();

  const profile = getProfileByUid(profileUid);
  const services = getServicesByUid(profileUid);
  const reviews = getProfileReviews(profileUid);
  const availability = availabilities.find(a => a.professionalUid === profileUid);

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Expert Profile Not Found</h2>
        <button onClick={onBack} className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl">
          Return to Marketplace
        </button>
      </div>
    );
  }

  const saved = currentUser ? isExpertSaved(currentUser.uid, profileUid) : false;

  const handleSaveToggle = () => {
    if (!currentUser) {
      openAuthModal('client', 'signin');
      return;
    }
    toggleSaveExpert(currentUser.uid, profileUid);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Experts Marketplace</span>
      </button>

      {/* Main Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        
        {/* Cover Accent Header */}
        <div className="h-36 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 p-6 flex items-start justify-end">
          <button
            onClick={handleSaveToggle}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              saved
                ? 'bg-teal-500 text-slate-950'
                : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20'
            }`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{saved ? 'Saved to Favorites' : 'Save Expert'}</span>
          </button>
        </div>

        {/* Profile Content Body */}
        <div className="px-6 sm:px-8 pb-8 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 mb-6">
            
            <div className="flex items-end gap-5">
              <img
                src={profile.profilePhotoUrl}
                alt={profile.fullName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-slate-100 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {profile.fullName}
                  </h1>
                  <VerificationBadge status={profile.verificationStatus} />
                </div>
                <p className="text-sm font-semibold text-slate-600">{profile.headline}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.city}, {profile.state}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-slate-700">{profile.experienceYears} Years Senior Experience</span>
                </div>
              </div>
            </div>

            {/* Overall Rating Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0 space-y-1 text-center sm:text-right">
              <RatingStars rating={profile.ratingAverage || 5} reviewCount={profile.reviewCount || 0} size={18} />
              <p className="text-[11px] text-slate-400 font-medium">Verified Client Feedback</p>
            </div>

          </div>

          {/* Bio section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">About & Background</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile.biography}
            </p>
          </div>

          {/* Work Modes & Industries */}
          <div className="flex flex-wrap gap-4 pt-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Work Modes</span>
              <div className="flex gap-1.5">
                {profile.workModes.map(m => (
                  <WorkModeBadge key={m} mode={m} />
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Industries</span>
              <div className="flex flex-wrap gap-1">
                {profile.industries.map(ind => (
                  <span key={ind} className="px-2.5 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Grid: Services offered + Career timeline & Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Services & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Services Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-lg text-slate-900">Services & Rates</h3>
              <span className="text-xs text-slate-500">{services.length} Active Offerings</span>
            </div>

            {services.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No services listed yet.</p>
            ) : (
              <div className="space-y-4">
                {services.map(serv => (
                  <div
                    key={serv.serviceId}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                          {serv.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">• {serv.duration}</span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900">{serv.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{serv.description}</p>
                    </div>

                    <div className="sm:text-right shrink-0 space-y-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price</span>
                        <span className="text-lg font-extrabold text-teal-700">
                          ₹{(serv.hourlyRate || serv.fixedPrice || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500">{serv.pricingType === 'hourly' ? '/hr' : ' fixed'}</span>
                      </div>

                      <button
                        onClick={() => openBooking(profile.uid, serv.serviceId)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors"
                      >
                        Book Service
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Reviews Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-lg text-slate-900">Verified Client Reviews</h3>
              </div>
              <span className="text-xs text-slate-500">{reviews.length} Reviews</span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No published reviews yet.</p>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {reviews.map(rev => (
                  <div key={rev.reviewId} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{rev.clientName}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <RatingStars rating={rev.rating} size={14} showValue={false} />
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Work History & Weekly Availability */}
        <div className="space-y-8">
          
          {/* Work History */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-600" />
              <span>Career & Qualifications</span>
            </h3>

            <div className="space-y-4">
              {profile.employmentHistory.map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-teal-500 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">{exp.jobTitle}</h4>
                  <p className="text-[11px] text-slate-600 font-medium">{exp.company} • {exp.years} Years</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{exp.responsibilities}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Qualifications</span>
              <div className="flex flex-wrap gap-1">
                {profile.qualifications.map(q => (
                  <span key={q} className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Availability schedule */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Weekly Availability</span>
            </h3>

            {availability ? (
              <div className="space-y-2 text-xs">
                <p className="text-[11px] text-slate-500 mb-2">Time zone: <strong>{availability.timeZone}</strong></p>
                {Object.entries(availability.weeklySchedule).map(([day, slots]) => (
                  <div key={day} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-800">{day}</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {slots.map(slot => (
                        <span key={slot} className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold text-[10px]">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Availability slots dynamically assigned during booking request.</p>
            )}

            <button
              onClick={() => openBooking(profile.uid)}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors mt-2"
            >
              Request Booking with {profile.fullName.split(' ')[0]}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
