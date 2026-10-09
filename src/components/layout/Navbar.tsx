import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  User as UserIcon, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Briefcase,
  Bookmark,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAiSearch }) => {
  const { currentUser, logout, openAuthModal, switchRole } = useAuth();
  const { notifications, savedExperts } = useDatabase();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = currentUser 
    ? notifications.filter(n => n.recipientUid === currentUser.uid && !n.readAt).length 
    : 0;

  const clientSavedCount = currentUser && currentUser.role === 'client'
    ? savedExperts.filter(s => s.clientUid === currentUser.uid).length
    : 0;

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-slate-900 shadow-md group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-2xl tracking-wider text-white font-sans">
                    VETEREN
                  </span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.2 rounded font-semibold uppercase tracking-widest">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Experience Never Retires.
                </p>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'home' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('experts')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'experts' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Find Experts
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'how-it-works' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'about' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'contact' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Help & Support
              </button>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* AI Search Trigger */}
            <button
              onClick={openAiSearch}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-teal-300 text-xs font-semibold shadow-inner transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>AI Matcher</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                
                {/* Dashboard Nav Button depending on role */}
                {currentUser.role === 'professional' && (
                  <button
                    onClick={() => handleNavClick('dashboard-prof')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-medium hover:bg-teal-500/20 transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Pro Dashboard</span>
                  </button>
                )}

                {currentUser.role === 'client' && (
                  <button
                    onClick={() => handleNavClick('dashboard-client')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-medium hover:bg-teal-500/20 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Client Hub ({clientSavedCount})</span>
                  </button>
                )}

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin-portal')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-500/30 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </button>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-500 text-slate-900 font-bold text-[10px] flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <NotificationDropdown 
                    isOpen={isNotifOpen} 
                    onClose={() => setIsNotifOpen(false)} 
                  />
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-slate-900 font-bold text-xs flex items-center justify-center overflow-hidden">
                      {currentUser.profilePhotoUrl ? (
                        <img src={currentUser.profilePhotoUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.fullName.charAt(0)
                      )}
                    </div>
                    <span className="hidden md:inline-block text-xs font-semibold text-white max-w-[100px] truncate">
                      {currentUser.fullName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-bold text-xs text-slate-900 truncate">{currentUser.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                          {currentUser.role} Account
                        </span>
                      </div>

                      {currentUser.role === 'professional' && (
                        <button
                          onClick={() => { setIsUserMenuOpen(false); handleNavClick('dashboard-prof'); }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          Professional Dashboard
                        </button>
                      )}

                      {currentUser.role === 'client' && (
                        <button
                          onClick={() => { setIsUserMenuOpen(false); handleNavClick('dashboard-client'); }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          Client Dashboard
                        </button>
                      )}

                      {/* Role Quick Switch Demo options */}
                      <div className="border-t border-slate-100 my-1 pt-1">
                        <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Switch Role Context
                        </p>
                        <button
                          onClick={() => { setIsUserMenuOpen(false); switchRole('client'); }}
                          className={`w-full text-left px-4 py-1.5 text-xs font-medium ${currentUser.role === 'client' ? 'text-teal-600 font-bold bg-teal-50' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          Client View
                        </button>
                        <button
                          onClick={() => { setIsUserMenuOpen(false); switchRole('professional'); }}
                          className={`w-full text-left px-4 py-1.5 text-xs font-medium ${currentUser.role === 'professional' ? 'text-teal-600 font-bold bg-teal-50' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          Professional View
                        </button>
                        <button
                          onClick={() => { setIsUserMenuOpen(false); switchRole('admin'); }}
                          className={`w-full text-left px-4 py-1.5 text-xs font-medium ${currentUser.role === 'admin' ? 'text-purple-600 font-bold bg-purple-50' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          Admin View
                        </button>
                      </div>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => { setIsUserMenuOpen(false); logout(); }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('client', 'signin')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('client', 'signup')}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white lg:hidden rounded-lg hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'home' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300'}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('experts')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'experts' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300'}`}
          >
            Find Experts
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'how-it-works' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300'}`}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'about' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300'}`}
          >
            About VETEREN
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'contact' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-300'}`}
          >
            Help & Contact
          </button>
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => { setIsMobileMenuOpen(false); openAiSearch(); }}
              className="flex-1 py-2 rounded-lg bg-slate-800 text-teal-300 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Matcher
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
