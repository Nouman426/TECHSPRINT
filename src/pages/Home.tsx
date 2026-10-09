import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  Users, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  LineChart, 
  Cpu, 
  GraduationCap, 
  HeartHandshake, 
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { VerificationBadge } from '../components/common/Badge';
import { RatingStars } from '../components/common/RatingStars';
import { ProfessionalProfile } from '../types';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  openBooking: (profileUid: string) => void;
  openExpertDetail: (profileUid: string) => void;
  openAiSearch: () => void;
}

export const Home: React.FC<HomeProps> = ({ 
  setActiveTab, 
  openBooking, 
  openExpertDetail,
  openAiSearch 
}) => {
  const { profiles, services } = useDatabase();
  const { currentUser, openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProfiles = profiles.filter(p => p.publicationStatus === 'published').slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('experts');
  };

  // Check if current user is professional and profile is incomplete
  const currentProfProfile = currentUser?.role === 'professional' ? profiles.find(p => p.uid === currentUser.uid) : null;
  const isProfileIncomplete = currentProfProfile && (currentProfProfile.profileCompletion < 100 || currentProfProfile.publicationStatus === 'draft');

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* Non-blocking warning banner for professionals with incomplete profile */}
      {isProfileIncomplete && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-900 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Complete your professional profile to get verified and start receiving booking requests!</span>
            </div>
            <button
              onClick={() => setActiveTab('dashboard-prof')}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors"
            >
              Complete Profile
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-24 rounded-b-3xl shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-teal-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Connect Experience With Opportunity</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Experience Never Retires.
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
              Discover experienced professionals for consulting, mentoring, teaching, and specialized services—or share your own experience with people who need it.
            </p>

            {/* Quick Search Box */}
            <form onSubmit={handleSearchSubmit} className="pt-4 max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-slate-100">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by skill, industry, or expert name (e.g., CFO, AI Architecture, HR)..."
                  className="w-full px-3 py-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2"
                >
                  <span>Search Experts</span>
                </button>
              </div>
            </form>

            {/* AI Assistant Quick Trigger */}
            <div className="pt-1 flex items-center justify-center gap-2">
              <button
                onClick={openAiSearch}
                className="text-xs text-teal-300 hover:text-teal-200 font-semibold underline flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                Try Gemini Smart Prompt Matching ("I need a finance expert for cash flow...")
              </button>
            </div>

            {/* Primary & Secondary Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab('experts')}
                className="px-7 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/20 transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Find an Expert</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => openAuthModal('professional', 'signup')}
                className="px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 shadow-md transition-all hover:scale-105"
              >
                Join as a Professional
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-2">
            <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-xl mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Verified Credentials</h4>
            <p className="text-xs text-slate-500">Every expert's work history and credentials undergo review before public publication.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-2">
            <div className="w-12 h-12 bg-sky-50 text-sky-700 rounded-xl mx-auto flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Decades of Wisdom</h4>
            <p className="text-xs text-slate-500">Connect directly with retired CFOs, university heads, VP architects, and senior directors.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-2">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl mx-auto flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Direct Consultation</h4>
            <p className="text-xs text-slate-500">Transparent rates, flexible online or in-person sessions, and real customer reviews.</p>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Explore Expertise Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Browse seasoned specialists across key commercial & technical disciplines.</p>
          </div>
          <button
            onClick={() => setActiveTab('experts')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Finance', icon: LineChart, bg: 'bg-emerald-50 text-emerald-700' },
            { title: 'Technology', icon: Cpu, bg: 'bg-sky-50 text-sky-700' },
            { title: 'Engineering', icon: Building2, bg: 'bg-indigo-50 text-indigo-700' },
            { title: 'Teaching', icon: GraduationCap, bg: 'bg-amber-50 text-amber-700' },
            { title: 'Human Resources', icon: Users, bg: 'bg-purple-50 text-purple-700' },
            { title: 'Business Strategy', icon: Briefcase, bg: 'bg-teal-50 text-teal-700' },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.title}
                onClick={() => setActiveTab('experts')}
                className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-teal-300 shadow-sm hover:shadow-md transition-all text-center group"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.bg} mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xs text-slate-800 group-hover:text-teal-700 transition-colors">
                  {cat.title}
                </h3>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Professionals from Database */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured Senior Experts</h2>
            <p className="text-sm text-slate-500 mt-1">Directly available for project advisory, mentoring, and hourly consulting.</p>
          </div>
          <button
            onClick={() => setActiveTab('experts')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>See All Experts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProfiles.map((prof) => {
            const profServices = services.filter(s => s.professionalUid === prof.uid && s.activeStatus);
            const minRate = profServices.length > 0
              ? Math.min(...profServices.map(s => s.hourlyRate || s.fixedPrice || 0))
              : 2000;

            return (
              <div
                key={prof.uid}
                className="bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  {/* Photo & Header */}
                  <div className="flex items-start gap-3">
                    <img
                      src={prof.profilePhotoUrl}
                      alt={prof.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                          {prof.fullName}
                        </h3>
                        <VerificationBadge status={prof.verificationStatus} showText={false} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">{prof.headline}</p>
                      <div className="mt-1">
                        <RatingStars rating={prof.ratingAverage || 5} reviewCount={prof.reviewCount || 0} />
                      </div>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1">
                    {prof.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prof.biography}
                  </p>

                  {/* Experience & Rate summary */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{prof.experienceYears} Years Exp.</span>
                    <span className="font-bold text-teal-700">From ₹{minRate.toLocaleString('en-IN')}/hr</span>
                  </div>
                </div>

                {/* Card Action buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openExpertDetail(prof.uid)}
                    className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => openBooking(prof.uid)}
                    className="py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold text-center transition-colors shadow-sm"
                  >
                    Request Booking
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Simple Workflow</span>
            <h2 className="text-3xl font-extrabold mt-1">How VETEREN Works</h2>
            <p className="text-sm text-slate-400 mt-2">Connecting senior professionals with clients in a seamless, secure environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Professional Journey */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                <Briefcase className="w-6 h-6 text-teal-400" />
                <h3 className="font-bold text-lg text-white">For Retired Professionals</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>Register & complete your 6-step profile wizard.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>Submit credentials for administrative verification.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Define services, hourly rates (₹), and weekly availability slots.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                  <span>Accept booking requests and deliver impactful advisory sessions.</span>
                </li>
              </ul>
              <button
                onClick={() => openAuthModal('professional', 'signup')}
                className="mt-4 w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Start as a Professional
              </button>
            </div>

            {/* Client Journey */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                <Users className="w-6 h-6 text-sky-400" />
                <h3 className="font-bold text-lg text-white">For Clients & Organizations</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>Search experts by skill, category, or AI prompt.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>Compare verified work histories, services, and rates.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Submit booking requests with automatic price estimates.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                  <span>Complete session and publish genuine reviews.</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveTab('experts')}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors"
              >
                Browse All Experts
              </button>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
