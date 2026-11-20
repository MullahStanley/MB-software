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
import { api } from './api';

export const App: React.FC = () => {
  // Start on the Landing Page
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [username, setUsername] = useState<string>('QuietWanderer24');
  
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
      {/* Navigation Bar */}
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
            onNavigate={setCurrentTab}
            onOpenEmergency={() => handleTriggerThreshold(4, 'landing_action')}
            onOpenTransparency={() => setIsTransparencyOpen(true)}
            onOpenPro={() => setIsProOpen(true)}
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
            <span className="text-xs text-[#2B2E2B]/60 font-medium">
              Logged in anonymously as <strong className="text-[#1B4326]">@{username}</strong>
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

      {/* App Workspace Footer (Shown when inside specific modules) */}
      {currentTab !== 'landing' && (
        <footer className="bg-[#1B4326] text-[#F4F1EA] border-t-2 border-[#1B4326] py-8 text-xs mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-base text-[#F4F1EA] tracking-tight">Mental Beacon (MB)</span>
              <span className="text-[#C8B87E]">• Youth Wellbeing & Grounding (15–35)</span>
            </div>

            <div className="flex items-center space-x-4 text-[#F4F1EA]/80">
              <button
                onClick={() => setIsTransparencyOpen(true)}
                className="hover:text-[#F4F1EA] transition-colors"
              >
                Data Sovereignty & Zero Ads
              </button>
              <span>•</span>
              <button
                onClick={() => setIsProOpen(true)}
                className="hover:text-[#C8B87E] transition-colors"
              >
                Sustainability Model
              </button>
              <span>•</span>
              <button
                onClick={() => handleTriggerThreshold(5, 'footer_crisis')}
                className="text-rose-300 hover:text-white transition-colors font-bold"
              >
                Crisis Helplines (988)
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
