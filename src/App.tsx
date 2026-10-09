import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { Home } from './pages/Home';
import { FindExperts } from './pages/FindExperts';
import { ExpertDetail } from './pages/ExpertDetail';
import { HowItWorks } from './pages/HowItWorks';
import { About } from './pages/About';
import { HelpContact } from './pages/HelpContact';
import { TermsPrivacy } from './pages/TermsPrivacy';
import { ClientDashboard } from './pages/ClientDashboard';
import { ProfessionalDashboard } from './pages/ProfessionalDashboard';
import { AdminPortal } from './pages/AdminPortal';
import { BookingModal } from './components/marketplace/BookingModal';
import { BookingConfirmationModal } from './components/marketplace/BookingConfirmationModal';
import { AiMatchModal } from './components/marketplace/AiMatchModal';
import { Booking } from './types';

const MainAppContent: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedExpertUid, setSelectedExpertUid] = useState<string | null>('prof-1');
  
  // Booking modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingExpertUid, setBookingExpertUid] = useState<string>('prof-1');
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  
  // Receipt modal
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // AI Search modal
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);

  const openBooking = (profileUid: string, serviceId?: string) => {
    setBookingExpertUid(profileUid);
    setBookingServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const openExpertDetail = (profileUid: string) => {
    setSelectedExpertUid(profileUid);
    setActiveTab('expert-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            setActiveTab={setActiveTab}
            openBooking={openBooking}
            openExpertDetail={openExpertDetail}
            openAiSearch={() => setIsAiSearchOpen(true)}
          />
        );
      case 'experts':
        return (
          <FindExperts
            openBooking={openBooking}
            openExpertDetail={openExpertDetail}
            openAiSearch={() => setIsAiSearchOpen(true)}
          />
        );
      case 'expert-detail':
        return (
          <ExpertDetail
            profileUid={selectedExpertUid || 'prof-1'}
            onBack={() => setActiveTab('experts')}
            openBooking={openBooking}
          />
        );
      case 'how-it-works':
        return (
          <HowItWorks
            openAuthModal={() => {}}
            setActiveTab={setActiveTab}
          />
        );
      case 'about':
        return <About />;
      case 'contact':
        return <HelpContact />;
      case 'terms':
        return <TermsPrivacy initialTab="terms" />;
      case 'privacy':
        return <TermsPrivacy initialTab="privacy" />;
      case 'dashboard-client':
        return (
          <ClientDashboard
            setActiveTab={setActiveTab}
            openExpertDetail={openExpertDetail}
          />
        );
      case 'dashboard-prof':
        return (
          <ProfessionalDashboard
            openExpertDetail={openExpertDetail}
          />
        );
      case 'admin-portal':
        return <AdminPortal />;
      default:
        return (
          <Home
            setActiveTab={setActiveTab}
            openBooking={openBooking}
            openExpertDetail={openExpertDetail}
            openAiSearch={() => setIsAiSearchOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiSearch={() => setIsAiSearchOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onAuthSuccess={() => setActiveTab('home')}
      />

      {/* Booking Form Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        professionalUid={bookingExpertUid}
        initialServiceId={bookingServiceId}
        onBookingSuccess={(booking) => setConfirmedBooking(booking)}
      />

      {/* Booking Confirmation Receipt */}
      <BookingConfirmationModal
        isOpen={Boolean(confirmedBooking)}
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        onViewDashboard={() => setActiveTab('dashboard-client')}
      />

      {/* AI Smart Matcher Modal */}
      <AiMatchModal
        isOpen={isAiSearchOpen}
        onClose={() => setIsAiSearchOpen(false)}
        openBooking={openBooking}
        openExpertDetail={openExpertDetail}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <MainAppContent />
      </DatabaseProvider>
    </AuthProvider>
  );
};

export default App;
