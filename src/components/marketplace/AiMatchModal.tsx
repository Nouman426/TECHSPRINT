import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useDatabase } from '../../context/DatabaseContext';
import { matchExpertsWithAi, AiMatchResult } from '../../services/geminiService';
import { Sparkles, Search, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { VerificationBadge } from '../common/Badge';

interface AiMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  openBooking: (profileUid: string) => void;
  openExpertDetail: (profileUid: string) => void;
}

export const AiMatchModal: React.FC<AiMatchModalProps> = ({
  isOpen,
  onClose,
  openBooking,
  openExpertDetail
}) => {
  const { profiles, services } = useDatabase();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<AiMatchResult | null>(null);

  const samplePrompts = [
    "I need a finance expert for small business cash flow and working capital restructuring.",
    "Looking for a retired VP to review my startup cloud software architecture.",
    "Need a senior HR leader to draft employee handbook and POSH policy guidelines.",
    "Academic mentor to help me prepare for university interview & public speaking."
  ];

  const handleMatch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || prompt;
    if (!queryToUse) return;

    setLoading(true);
    try {
      const result = await matchExpertsWithAi(queryToUse, profiles, services);
      setMatchResult(result);
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      
      <div className="space-y-6 font-sans">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-teal-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>Gemini AI Smart Matcher</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            Describe What You Need In Plain Language
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Our AI engine parses your prompt into category, skills, and budget criteria to match against verified real database expert profiles.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={e => handleMatch(e)} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. 'I need an experienced CFO to help my small business understand cash flow and treasury management...'"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block w-full">Try Sample Prompts:</span>
            {samplePrompts.map(sp => (
              <button
                key={sp}
                type="button"
                onClick={() => { setPrompt(sp); handleMatch(undefined, sp); }}
                className="text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 text-left transition-colors"
              >
                "{sp.slice(0, 45)}..."
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !prompt}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Analyzing Query with AI...' : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Intelligent AI Expert Match</span>
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {matchResult && (
          <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-teal-900 block">{matchResult.explanation}</span>
                {matchResult.category && <span className="text-[11px] text-teal-700">Category: {matchResult.category}</span>}
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-200 px-2.5 py-0.5 rounded-full">
                {matchResult.matchedProfiles.length} Matches Found
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {matchResult.matchedProfiles.map(item => (
                <div key={item.profile.uid} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.profile.profilePhotoUrl} alt={item.profile.fullName} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900">{item.profile.fullName}</h4>
                        <VerificationBadge status={item.profile.verificationStatus} showText={false} />
                      </div>
                      <p className="text-[11px] text-slate-500">{item.profile.headline}</p>
                      <p className="text-[10px] text-teal-700 font-semibold mt-0.5">Match Reason: {item.matchReason}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { onClose(); openExpertDetail(item.profile.uid); }}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => { onClose(); openBooking(item.profile.uid); }}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </Modal>
  );
};
