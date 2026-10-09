import React, { useState } from 'react';
import { Award, Download, RefreshCw, ShieldCheck, Heart } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { exportProjectZip, triggerDownload } from '../../services/zipExporter';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { resetDemoData } = useDatabase();
  const [isExporting, setIsExporting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      const blob = await exportProjectZip();
      triggerDownload(blob, 'veteren-hackathon-source.zip');
    } catch (e) {
      console.error("ZIP export failed:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
    window.location.reload();
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-900 shadow-lg">
                <Award className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-wider text-white">
                  VETEREN
                </span>
                <p className="text-xs text-teal-400 font-semibold">Experience Never Retires.</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Connect Experience With Opportunity. VETEREN is a specialized marketplace connecting retired professionals, senior advisors, and experienced experts with individuals and organizations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Expertise
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Hackathon MVP Edition
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-teal-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('experts')} className="hover:text-teal-400 transition-colors">
                  Find Experts
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-teal-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-teal-400 transition-colors">
                  About VETEREN
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Expertise Fields
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Finance & Advisory</li>
              <li>Technology & AI</li>
              <li>Engineering & Projects</li>
              <li>Teaching & Mentoring</li>
              <li>Human Resources</li>
              <li>Business Strategy</li>
            </ul>
          </div>

          {/* Legal & Hackathon Utilities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Support & Code
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-teal-400 transition-colors">
                  Help & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('terms')} className="hover:text-teal-400 transition-colors">
                  Terms of Service (Draft)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('privacy')} className="hover:text-teal-400 transition-colors">
                  Privacy Policy (Draft)
                </button>
              </li>
            </ul>

            {/* Code Export Button */}
            <div className="pt-4 space-y-2">
              <button
                onClick={handleDownloadZip}
                disabled={isExporting}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                {isExporting ? 'Exporting...' : 'Export Source (.ZIP)'}
              </button>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-slate-400 hover:text-red-400 text-xs font-medium transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Demo Data
              </button>
            </div>
          </div>

        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center justify-between gap-4">
            <span>Are you sure you want to reset all local storage database records back to initial sample state?</span>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleReset}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Yes, Reset Data
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} VETEREN Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built for College Hackathon MVP</span>
            <Heart className="w-3 h-3 text-teal-400 fill-teal-400 inline" />
          </p>
        </div>

      </div>
    </footer>
  );
};
