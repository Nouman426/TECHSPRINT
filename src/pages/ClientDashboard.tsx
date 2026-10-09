import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { VerificationBadge, WorkModeBadge } from '../components/common/Badge';
import { RatingStars } from '../components/common/RatingStars';
import { Modal } from '../components/common/Modal';
import { 
  Bookmark, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Star, 
  AlertCircle,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Booking, Review } from '../types';

interface ClientDashboardProps {
  setActiveTab: (tab: string) => void;
  openExpertDetail: (profileUid: string) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ setActiveTab, openExpertDetail }) => {
  const { currentUser } = useAuth();
  const { getUserBookings, updateBookingStatus, savedExperts, getProfileByUid, addReview, reviews } = useDatabase();

  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'saved'>('bookings');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  // Review Form state
  const [starRating, setStarRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  if (!currentUser) return null;

  const clientBookings = getUserBookings(currentUser.uid, 'client');
  const clientSavedList = savedExperts.filter(se => se.clientUid === currentUser.uid);

  const handleCancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'Cancelled', 'Cancelled by client from dashboard.');
  };

  const handleMarkCompletedDemo = (bookingId: string) => {
    updateBookingStatus(bookingId, 'Completed');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;

    if (!comment) {
      setReviewError("Please enter your written feedback.");
      return;
    }

    addReview({
      bookingId: selectedBookingForReview.bookingId,
      clientUid: currentUser.uid,
      clientName: currentUser.fullName,
      professionalUid: selectedBookingForReview.professionalUid,
      rating: starRating,
      comment
    });

    setSelectedBookingForReview(null);
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Client Account Hub
          </span>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {currentUser.fullName}!</h1>
          <p className="text-xs text-slate-300 max-w-lg">
            Manage your requested expert bookings, saved favorites, and published reviews.
          </p>
        </div>

        <div className="flex gap-3 z-10 shrink-0">
          <button
            onClick={() => setActiveTab('experts')}
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Find New Experts</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`pb-3 px-6 font-bold text-sm transition-colors relative flex items-center gap-2 ${
            activeSubTab === 'bookings'
              ? 'text-teal-700 border-b-2 border-teal-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Bookings ({clientBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`pb-3 px-6 font-bold text-sm transition-colors relative flex items-center gap-2 ${
            activeSubTab === 'saved'
              ? 'text-teal-700 border-b-2 border-teal-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Experts ({clientSavedList.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {activeSubTab === 'bookings' ? (
        <div className="space-y-4">
          {clientBookings.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No booking history yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our expert marketplace to find senior consultants and request your first session.
              </p>
              <button
                onClick={() => setActiveTab('experts')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {clientBookings.map(b => {
                const hasReviewed = reviews.some(r => r.bookingId === b.bookingId);

                return (
                  <div
                    key={b.bookingId}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base">{b.serviceTitle}</span>
                          <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                            b.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            b.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                            b.status === 'Declined' || b.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Professional: <strong className="text-slate-800">{b.professionalName}</strong> • Ref: {b.bookingId.toUpperCase()}
                        </p>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="text-xs font-bold text-teal-700 text-base">₹{b.priceEstimate.toLocaleString('en-IN')}</span>
                        <p className="text-[11px] text-slate-400">{b.requestedDate} at {b.requestedTime}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                      "{b.requirementDescription}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-slate-500">
                        Meeting Mode: <strong className="capitalize text-slate-800">{b.meetingMode}</strong>
                        {b.location && <span> ({b.location})</span>}
                      </div>

                      <div className="flex gap-2">
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelBooking(b.bookingId)}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                          >
                            Cancel Request
                          </button>
                        )}

                        {b.status === 'Accepted' && (
                          <button
                            onClick={() => handleMarkCompletedDemo(b.bookingId)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                          >
                            Mark Completed (Demo)
                          </button>
                        )}

                        {b.status === 'Completed' && !hasReviewed && (
                          <button
                            onClick={() => { setSelectedBookingForReview(b); setStarRating(5); setComment(''); }}
                            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Leave Review</span>
                          </button>
                        )}

                        {b.status === 'Completed' && hasReviewed && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Review Published</span>
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Saved Experts List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientSavedList.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No saved experts</h3>
              <p className="text-xs text-slate-500">Save senior advisors while browsing the marketplace to quickly access them later.</p>
            </div>
          ) : (
            clientSavedList.map(se => {
              const prof = getProfileByUid(se.professionalUid);
              if (!prof) return null;

              return (
                <div key={se.savedExpertId} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={prof.profilePhotoUrl} alt={prof.fullName} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{prof.fullName}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{prof.headline}</p>
                      <RatingStars rating={prof.ratingAverage || 5} reviewCount={prof.reviewCount || 0} />
                    </div>
                  </div>

                  <button
                    onClick={() => openExpertDetail(prof.uid)}
                    className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    View Profile
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Review Submission Modal */}
      {selectedBookingForReview && (
        <Modal
          isOpen={Boolean(selectedBookingForReview)}
          onClose={() => setSelectedBookingForReview(null)}
          maxWidth="md"
          title="Review Completed Service"
          subtitle={`Session with ${selectedBookingForReview.professionalName}`}
        >
          {reviewError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
              {reviewError}
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rating (1 to 5 stars)</label>
              <RatingStars
                rating={starRating}
                interactive={true}
                onRate={r => setStarRating(r)}
                size={24}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Written Feedback *</label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share how the expert helped your business or career..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForReview(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md"
              >
                Publish Review
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
