import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  SlidersHorizontal, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Briefcase,
  X,
  ChevronRight
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { VerificationBadge, WorkModeBadge } from '../components/common/Badge';
import { RatingStars } from '../components/common/RatingStars';
import { ServiceCategory, WorkMode } from '../types';

interface FindExpertsProps {
  openBooking: (profileUid: string) => void;
  openExpertDetail: (profileUid: string) => void;
  openAiSearch: () => void;
}

export const FindExperts: React.FC<FindExpertsProps> = ({ 
  openBooking, 
  openExpertDetail,
  openAiSearch 
}) => {
  const { profiles, services } = useDatabase();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [locationQuery, setLocationQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'priceAsc' | 'priceDesc'>('rating');

  const categories: string[] = [
    'All',
    'Finance',
    'Technology',
    'Engineering',
    'Teaching',
    'Career Mentoring',
    'Human Resources',
    'Business Management',
    'Project Advisory',
    'Training'
  ];

  // Filter logic executed against actual database records
  const filteredExperts = useMemo(() => {
    return profiles.filter(prof => {
      // Must be published
      if (prof.publicationStatus !== 'published') return false;

      // Text search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = prof.fullName.toLowerCase().includes(query);
        const matchesHeadline = prof.headline.toLowerCase().includes(query);
        const matchesBio = prof.biography.toLowerCase().includes(query);
        const matchesSkills = prof.skills.some(s => s.toLowerCase().includes(query));
        const profServices = services.filter(s => s.professionalUid === prof.uid);
        const matchesServices = profServices.some(s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
        
        if (!matchesName && !matchesHeadline && !matchesBio && !matchesSkills && !matchesServices) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All') {
        const hasCategory = prof.industries.includes(selectedCategory) ||
          services.some(s => s.professionalUid === prof.uid && s.category === selectedCategory);
        if (!hasCategory) return false;
      }

      // Work mode filter
      if (selectedWorkMode !== 'All') {
        if (!prof.workModes.includes(selectedWorkMode as WorkMode)) return false;
      }

      // Experience filter
      if (prof.experienceYears < minExperience) return false;

      // Location filter
      if (locationQuery) {
        const loc = locationQuery.toLowerCase();
        const matchesLoc = prof.city.toLowerCase().includes(loc) || prof.state.toLowerCase().includes(loc);
        if (!matchesLoc) return false;
      }

      // Price filter
      const profServices = services.filter(s => s.professionalUid === prof.uid && s.activeStatus);
      if (profServices.length > 0) {
        const lowestRate = Math.min(...profServices.map(s => s.hourlyRate || s.fixedPrice || 0));
        if (lowestRate > maxPrice) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.ratingAverage || 0) - (a.ratingAverage || 0);
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      
      const getMinRate = (uid: string) => {
        const profServs = services.filter(s => s.professionalUid === uid);
        return profServs.length > 0 ? Math.min(...profServs.map(s => s.hourlyRate || s.fixedPrice || 0)) : 0;
      };

      if (sortBy === 'priceAsc') return getMinRate(a.uid) - getMinRate(b.uid);
      if (sortBy === 'priceDesc') return getMinRate(b.uid) - getMinRate(a.uid);
      return 0;
    });
  }, [profiles, services, searchTerm, selectedCategory, selectedWorkMode, minExperience, maxPrice, locationQuery, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedWorkMode('All');
    setMinExperience(0);
    setMaxPrice(10000);
    setLocationQuery('');
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Senior Experts & Advisors
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified retired professionals, consultants, and mentors across all commercial domains.
          </p>
        </div>

        {/* AI Smart Matcher Button */}
        <button
          onClick={openAiSearch}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs shadow-md transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>Use AI Matching Assistant</span>
        </button>
      </div>

      {/* Main Layout Grid (Filter Sidebar + Expert Cards List) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 lg:sticky lg:top-28">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Filter className="w-4 h-4 text-teal-600" />
              <span>Filter Marketplace</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] text-teal-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Name, skill, service..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expertise Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Mode</label>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'online', 'in-person', 'hybrid'].map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedWorkMode(mode)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    selectedWorkMode === mode
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Location filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">City / Location</label>
            <div className="relative">
              <input
                type="text"
                value={locationQuery}
                onChange={e => setLocationQuery(e.target.value)}
                placeholder="e.g. Mumbai, Bengaluru..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Minimum Experience Years Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Min Experience</span>
              <span className="text-teal-700 font-bold">{minExperience}+ Years</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={minExperience}
              onChange={e => setMinExperience(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Max Hourly Rate Filter */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Max Hourly Rate</span>
              <span className="text-teal-700 font-bold">₹{maxPrice.toLocaleString('en-IN')}/hr</span>
            </div>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

        </div>

        {/* Experts List */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting & Result Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-600 font-medium">
              Showing <strong className="text-slate-900">{filteredExperts.length}</strong> verified expert profiles
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none"
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experienced</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Expert Cards Grid */}
          {filteredExperts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No expert profiles found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search query, increasing max budget, or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExperts.map(prof => {
                const profServices = services.filter(s => s.professionalUid === prof.uid && s.activeStatus);
                const minRate = profServices.length > 0
                  ? Math.min(...profServices.map(s => s.hourlyRate || s.fixedPrice || 0))
                  : 2000;

                return (
                  <div
                    key={prof.uid}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      
                      {/* Photo & Main Details */}
                      <div className="flex gap-4">
                        <img
                          src={prof.profilePhotoUrl}
                          alt={prof.fullName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900 hover:text-teal-700 transition-colors">
                              {prof.fullName}
                            </h3>
                            <VerificationBadge status={prof.verificationStatus} />
                          </div>
                          <p className="text-xs font-semibold text-slate-600">{prof.headline}</p>
                          
                          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
                            <span className="font-bold text-slate-700">{prof.experienceYears} Years Experience</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {prof.city}, {prof.state}
                            </span>
                          </div>

                          <div className="pt-1">
                            <RatingStars rating={prof.ratingAverage || 5} reviewCount={prof.reviewCount || 0} />
                          </div>
                        </div>
                      </div>

                      {/* Rate & Work Mode Badge */}
                      <div className="sm:text-right shrink-0 space-y-2">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Starting Rate</span>
                          <span className="text-xl font-extrabold text-teal-700">₹{minRate.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-slate-500"> / hr</span>
                        </div>
                        <div className="flex gap-1 justify-start sm:justify-end">
                          {prof.workModes.map(m => (
                            <WorkModeBadge key={m} mode={m} />
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Bio & Skills */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {prof.biography}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                      
                      <div className="flex flex-wrap gap-1.5">
                        {prof.skills.map(skill => (
                          <span key={skill} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openExpertDetail(prof.uid)}
                          className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                        >
                          View Full Profile
                        </button>
                        <button
                          onClick={() => openBooking(prof.uid)}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          Request Booking
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
