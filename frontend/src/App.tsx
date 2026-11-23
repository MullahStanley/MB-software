import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Footer } from './components/Footer';
import { BeaconLoader } from './components/BeaconLoader';
import { api } from './api';

const Approach = lazy(() => import('./components/Approach').then((m) => ({ default: m.Approach })));
const MBCare = lazy(() => import('./components/MBCare').then((m) => ({ default: m.MBCare })));
const Booking = lazy(() => import('./components/Booking').then((m) => ({ default: m.Booking })));
const UnderDevelopment = lazy(() => import('./components/UnderDevelopment').then((m) => ({ default: m.UnderDevelopment })));

// Existing screens
const OnlineServiceInProgress = lazy(() =>
  import('./components/OnlineServiceInProgress').then((m) => ({ default: m.OnlineServiceInProgress }))
);
const Communities = lazy(() =>
  import('./components/Communities').then((m) => ({ default: m.Communities }))
);
const CheckupPatterns = lazy(() =>
  import('./components/CheckupPatterns').then((m) => ({ default: m.CheckupPatterns }))
);
const PrivateJournal = lazy(() =>
  import('./components/PrivateJournal').then((m) => ({ default: m.PrivateJournal }))
);
const BreathingExercise = lazy(() =>
  import('./components/BreathingExercise').then((m) => ({ default: m.BreathingExercise }))
);
const SoundCalmer = lazy(() =>
  import('./components/SoundCalmer').then((m) => ({ default: m.SoundCalmer }))
);
const ArticlesHub = lazy(() =>
  import('./components/ArticlesHub').then((m) => ({ default: m.ArticlesHub }))
);
const CalmingGames = lazy(() =>
  import('./components/CalmingGames').then((m) => ({ default: m.CalmingGames }))
);
const ChatBotCompanion = lazy(() =>
  import('./components/ChatBotCompanion').then((m) => ({ default: m.ChatBotCompanion }))
);
const AnalyticsDashboard = lazy(() =>
  import('./components/AnalyticsDashboard').then((m) => ({ default: m.AnalyticsDashboard }))
);

const TransparencyCenter = lazy(() =>
  import('./components/TransparencyCenter').then((m) => ({ default: m.TransparencyCenter }))
);
const SustainableProModal = lazy(() =>
  import('./components/SustainableProModal').then((m) => ({ default: m.SustainableProModal }))
);

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [username, setUsername] = useState<string>('QuietFern');

  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);

  useEffect(() => {
    api.trackPage(currentTab).catch(() => {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleTriggerThreshold = (level: number, details?: string) => {
    // Emergency resources removed; keep no-op for compatibility.
    void level; void details;
  };

  const renderScreen = () => {
    if (currentTab === 'home') {
      return (
        <Home
          onViewService={(tab) => setCurrentTab(tab || 'mbcare')}
          onGoArticles={() => setCurrentTab('articles')}
        />
      );
    }

    if (currentTab === 'approach') {
      return <Approach />;
    }

    if (currentTab === 'mbcare') {
      return <MBCare onBook={() => setCurrentTab('booking')} onGoHome={() => setCurrentTab('home')} />;
    }

    if (currentTab === 'booking') {
      return <Booking onGoHome={() => setCurrentTab('home')} />;
    }

    if (currentTab === 'underdev') {
      return (
        <UnderDevelopment
          onGoHome={() => setCurrentTab('home')}
          onGoArticles={() => setCurrentTab('articles')}
        />
      );
    }

    if (currentTab === 'service_in_progress') {
      return (
        <main className="flex-1 w-full">
          <OnlineServiceInProgress
            onBackToOverview={() => setCurrentTab('home')}
            onGoToForm={() => setCurrentTab('home')}
            onOpenEmergency={() => {}}
            onExplorePrototype={(tab) => setCurrentTab(tab)}
          />
        </main>
      );
    }

    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setCurrentTab('home')} className="text-xs font-semibold text-[#2E6F40] hover:text-[#1B4326] flex items-center space-x-1">
            <span>← Back to Home</span>
          </button>
          <span className="text-xs text-[#2B2E2B]/70 font-medium">
            Connected as <strong className="text-[#1B4326]">@{username}</strong>
          </span>
        </div>

        {currentTab === 'communities' && <Communities username={username} onTriggerThreshold={handleTriggerThreshold} />}
        {currentTab === 'checkups' && <CheckupPatterns onTriggerThreshold={handleTriggerThreshold} onNavigateTab={setCurrentTab} />}
        {currentTab === 'journal' && <PrivateJournal />}
        {currentTab === 'calm' && (
          <div className="space-y-6">
            <BreathingExercise />
            <SoundCalmer />
          </div>
        )}
        {currentTab === 'articles' && <ArticlesHub />}
        {currentTab === 'games' && <CalmingGames />}
        {currentTab === 'chat' && <ChatBotCompanion onTriggerThreshold={handleTriggerThreshold} onNavigateTab={setCurrentTab} />}
        {currentTab === 'analytics' && <AnalyticsDashboard />}
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2B2E2B] flex flex-col selection:bg-[#B9D2B9] selection:text-[#1B4326]">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        username={username}
        setUsername={setUsername}
        onOpenTransparency={() => setIsTransparencyOpen(true)}
        onOpenPro={() => setIsProOpen(true)}
      />

      <Suspense fallback={<BeaconLoader />}>
        <div key={currentTab} className="flex-1 flex flex-col w-full animate-page-in">
          {renderScreen()}
        </div>
      </Suspense>

      <Footer />

      <Suspense fallback={null}>
        {isTransparencyOpen && (
          <TransparencyCenter isOpen={isTransparencyOpen} onClose={() => setIsTransparencyOpen(false)} />
        )}
        {isProOpen && (
          <SustainableProModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />
        )}
      </Suspense>
    </div>
  );
};
