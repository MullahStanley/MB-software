import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
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
import { PageHeader } from './components/ui/PageHeader';
import { api } from './api';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('communities');
  const [username, setUsername] = useState<string>('Wanderer24');
  
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 selection:bg-forest-600 selection:text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-forest-700 focus:shadow-sm"
      >
        Skip to content
      </a>

      {/* Navigation */}
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
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {currentTab === 'communities' && (
          <Communities username={username} />
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
            <PageHeader
              eyebrow="Nervous system tools"
              title="Breathing & sound"
              description="Guided breath pacing and locally synthesized soundscapes you can start in one tap — no account, no downloads, no ads."
            />
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

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">Mental Beacon</span>
            <span aria-hidden="true">·</span>
            <span>Built for ages 15–35</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.flaticon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 hover:underline"
            >
              Icons from Flaticon
            </a>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              onClick={() => setIsTransparencyOpen(true)}
              className="hover:text-slate-900 hover:underline"
            >
              Data privacy & zero-ads
            </button>
            <button
              onClick={() => setIsProOpen(true)}
              className="hover:text-slate-900 hover:underline"
            >
              How we stay funded
            </button>
            <button
              onClick={() => handleTriggerThreshold(5, 'footer_crisis')}
              className="font-medium text-rose-600 hover:text-rose-700 hover:underline"
            >
              Crisis helplines (988)
            </button>
          </nav>
        </div>
      </footer>

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
