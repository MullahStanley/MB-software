import React, { useState } from 'react';
import { ShieldAlert, Lock, User } from 'lucide-react';
import { FlaticonIcon } from './ui/FlaticonIcon';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  username: string;
  setUsername: (name: string) => void;
  onOpenEmergency: () => void;
  onOpenTransparency: () => void;
  onOpenPro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  username,
  setUsername,
  onOpenEmergency,
  onOpenTransparency,
  onOpenPro
}) => {
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [tempUser, setTempUser] = useState(username);

  const navItems = [
    { id: 'communities', label: 'Communities' },
    { id: 'checkups', label: 'Daily patterns' },
    { id: 'journal', label: 'Journal' },
    { id: 'calm', label: 'Breathing & sound' },
    { id: 'articles', label: 'Guides' },
    { id: 'games', label: 'Grounding' },
    { id: 'chat', label: 'Companion' },
    { id: 'analytics', label: 'Metrics' },
  ];

  const handleSaveUser = () => {
    if (tempUser.trim()) {
      setUsername(tempUser.trim());
    }
    setIsEditingUser(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Brand */}
          <button
            type="button"
            onClick={() => setCurrentTab('communities')}
            className="flex items-center gap-2"
            aria-label="Mental Beacon — go to communities"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-600 text-white">
              <FlaticonIcon name="lighthouse.png" className="h-5 w-5 text-white" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              Mental Beacon
            </span>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Safety Circle Trigger */}
            <button
              type="button"
              onClick={onOpenEmergency}
              className="btn btn-sm btn-danger-outline"
              title="Trusted contacts & safety escalation"
            >
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Safety Circle</span>
            </button>

            {/* Privacy Transparency */}
            <button
              type="button"
              onClick={onOpenTransparency}
              className="btn btn-sm btn-quiet hidden sm:inline-flex"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Data privacy</span>
            </button>

            {/* Sustainability / Pro */}
            <button
              type="button"
              onClick={onOpenPro}
              className="btn btn-sm btn-quiet hidden md:inline-flex"
            >
              <span>How we stay funded</span>
            </button>

            {/* Anonymous username handle */}
            <div className="relative">
              {isEditingUser ? (
                <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white p-1">
                  <input
                    type="text"
                    value={tempUser}
                    onChange={(e) => setTempUser(e.target.value)}
                    className="field w-24 px-2 py-1 text-xs"
                    placeholder="Username"
                    aria-label="Anonymous username"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveUser}
                    className="btn btn-sm btn-primary"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingUser(true)}
                  className="btn btn-sm btn-quiet"
                  title="Click to change your anonymous username"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>@{username}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section tabs */}
        <nav aria-label="Sections" className="flex gap-0.5 overflow-x-auto border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`tab ${isActive ? 'tab-active' : ''}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
