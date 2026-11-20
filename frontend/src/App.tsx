import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Communities } from './components/Communities';
import { CheckupPatterns } from './components/CheckupPatterns';
import { PrivateJournal } from './components/PrivateJournal';
import { BreathingExercise } from './components/BreathingExercise';
import { SoundCalmer } from './components/SoundCalmer';
import { ArticlesHub } from './components/ArticlesHub';
import { CalmingGames } from './components/CalmingGames';
import { ChatBotCompanion } from './components/ChatBotCompanion';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EmergencyThresholdModal } from './components/EmergencyThresholdModal';
import { TransparencyCenter } from './components/TransparencyCenter';
import { SustainableProModal } from './components/SustainableProModal';
import { OnlineServiceInProgress } from './components/OnlineServiceInProgress';
import { api } from './api';

export const App: React.FC = () => {
  // Main view is the Landing Page
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [username, setUsername] = useState<string>('QuietFern');
  
  // Emergency Modal State
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState(4);
  const [emergencySource, setEmergencySource] = useState('manual');

  // Transparency & Pro Modals
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);

  // Track page view on tab change
  useEffect(() => {
    api.trackPage(currentTab);
  }, [currentTab]);

  const handleTriggerThreshold = (level: number, details?: string) => {
    setEmergencyLevel(level);
    setEmergencySource(details || 'system_trigger');
    setIsEmergencyOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2B2E2B] flex flex-col selection:bg-[#B9D2B9] selection:text-[#1B4326]">
      {/* Navigation Bar (Uncluttered: 0 items in landing mode) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        username={username}
        setUsername={setUsername}
        onOpenEmergency={() => handleTriggerThreshold(4, 'header_button')}
        onOpenTransparency={() => setIsTransparencyOpen(true)}
        onOpenPro={() => setIsProOpen(true)}
      />

      {/* Main Content Area */}
      {currentTab === 'landing' ? (
        <main className="flex-1 w-full">
          <LandingPage
            onViewService={(tab) => setCurrentTab(tab || 'service_in_progress')}
            onSetUsername={setUsername}
            onOpenEmergency={() => handleTriggerThreshold(4, 'landing_action')}
            onOpenTransparency={() => setIsTransparencyOpen(true)}
            onOpenPro={() => setIsProOpen(true)}
          />
        </main>
      ) : currentTab === 'service_in_progress' ? (
        <main className="flex-1 w-full">
          <OnlineServiceInProgress
            onBackToOverview={() => setCurrentTab('landing')}
            onGoToForm={() => setCurrentTab('landing')}
            onOpenEmergency={() => handleTriggerThreshold(4, 'in_progress_action')}
            onExplorePrototype={(tab) => setCurrentTab(tab)}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb / Back to Landing shortcut */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentTab('landing')}
              className="text-xs font-semibold text-[#2E6F40] hover:text-[#1B4326] flex items-center space-x-1"
            >
              <span>← Back to Sanctuary Overview</span>
            </button>
            <span className="text-xs text-[#2B2E2B]/70 font-medium">
              Connected as <strong className="text-[#1B4326]">@{username}</strong>
            </span>
          </div>

          {currentTab === 'communities' && (
            <Communities
              username={username}
              onTriggerThreshold={handleTriggerThreshold}
            />
          )}

          {currentTab === 'checkups' && (
            <CheckupPatterns
              onTriggerThreshold={handleTriggerThreshold}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'journal' && <PrivateJournal />}

          {currentTab === 'calm' && (
            <div className="space-y-6">
              <BreathingExercise />
              <SoundCalmer />
            </div>
          )}

          {currentTab === 'articles' && <ArticlesHub />}

          {currentTab === 'games' && <CalmingGames />}

          {currentTab === 'chat' && (
            <ChatBotCompanion
              onTriggerThreshold={handleTriggerThreshold}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'analytics' && <AnalyticsDashboard />}
        </main>
      )}

      {/* App Workspace Footer (Shown only when using internal online service, not on landing or in-progress page) */}
      {currentTab !== 'landing' && currentTab !== 'service_in_progress' && (
        <footer className="bg-[#1B4326] text-[#F4F1EA] border-t-2 border-[#1B4326] py-6 text-xs mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-sm text-[#F4F1EA] tracking-tight">Mental Beacon</span>
              <span className="text-[#F4F1EA]/60 text-[11px]">• Human-Centered Wellbeing Sanctuary</span>
            </div>

            <div className="flex items-center space-x-4 text-[#F4F1EA]/75 text-[11px]">
              <button
                onClick={() => setIsTransparencyOpen(true)}
                className="hover:text-[#F4F1EA] transition-colors"
              >
                Data Privacy (Fine Print)
              </button>
              <span>•</span>
              <button
                onClick={() => setIsProOpen(true)}
                className="hover:text-[#C8B87E] transition-colors"
              >
                Financial Model
              </button>
              <span>•</span>
              <button
                onClick={() => handleTriggerThreshold(5, 'footer_crisis')}
                className="text-rose-300 hover:text-white transition-colors font-medium"
              >
                988 Lifeline
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <EmergencyThresholdModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        activeLevel={emergencyLevel}
        initialSource={emergencySource}
        onNavigateTab={setCurrentTab}
      />

      <TransparencyCenter
        isOpen={isTransparencyOpen}
        onClose={() => setIsTransparencyOpen(false)}
      />

      <SustainableProModal
        isOpen={isProOpen}
        onClose={() => setIsProOpen(false)}
      />
    </div>
  );
};
