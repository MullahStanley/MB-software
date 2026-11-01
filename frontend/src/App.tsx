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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-8 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-tight">Mental Beacon (MB)</span>
            <span>• Built for Young Adult Development (15–35)</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsTransparencyOpen(true)}
              className="hover:text-teal-400 transition-colors"
            >
              Data Transparency & Zero Ad Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setIsProOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Financial Sustainability
            </button>
            <span>•</span>
            <button
              onClick={() => handleTriggerThreshold(5, 'footer_crisis')}
              className="text-rose-400 hover:text-rose-300 transition-colors font-medium"
            >
              Crisis Helplines (988)
            </button>
          </div>
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
