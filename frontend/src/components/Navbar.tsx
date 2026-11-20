import React from 'react';
import { 
  ArrowRight,
  ArrowLeft,
  Compass, 
  Activity, 
  BookOpen, 
  Wind, 
  FileText, 
  Gamepad2, 
  MessageSquareHeart, 
  ShieldAlert, 
  BarChart3,
  User,
  Check
} from 'lucide-react';

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
}) => {
  const isLanding = currentTab === 'landing';
  const [isEditingUser, setIsEditingUser] = React.useState(false);
  const [tempUser, setTempUser] = React.useState(username);

  const serviceItems = [
    { id: 'communities', label: 'Communities', icon: Compass },
    { id: 'calm', label: 'Breath & Sounds', icon: Wind },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'checkups', label: 'Check-up', icon: Activity },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'games', label: 'Calm Games', icon: Gamepad2 },
    { id: 'chat', label: 'Beacon AI', icon: MessageSquareHeart },
    { id: 'analytics', label: 'Impact', icon: BarChart3 },
  ];

  const handleSaveUser = () => {
    if (tempUser.trim()) {
      setUsername(tempUser.trim());
    }
    setIsEditingUser(false);
  };

  // 1. MINIMAL LANDING NAVBAR: Zero items in the navbar
  if (isLanding) {
    return (
      <header className="sticky top-0 z-40 bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#D8D4C9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand — MB CARE text only, no icon */}
            <div 
              className="cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1B4326] group-hover:text-[#2E6F40] transition-colors select-none">
                MB CARE
              </span>
            </div>

            {/* Right side action: No items in navbar, just clean CTA */}
            <div className="flex items-center space-x-4">
              <a
                href="#join-sanctuary"
                className="hidden sm:inline-block text-xs font-semibold text-[#1B4326] hover:text-[#2E6F40] transition-colors underline-offset-4 hover:underline"
              >
                Join Community
              </a>

              <button
                onClick={() => setCurrentTab('service_in_progress')}
                className="px-5 py-2.5 rounded-xl bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center space-x-2 border border-[#1B4326]"
              >
                <span>View our online service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // 2. MINIMAL ONLINE SERVICE (WEBAPP) HEADER
  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#D8D4C9] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back to landing page */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentTab('landing')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#F4F1EA] text-[#1B4326] border border-[#D8D4C9] hover:bg-[#B9D2B9]/30 text-xs font-semibold transition-all"
              title="Return to Landing Page Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#2E6F40]" />
              <span>Back to Overview</span>
            </button>

            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm font-serif font-bold text-[#1B4326]">
                Online Service Space
              </span>
            </div>
          </div>

          {/* Quick Support & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Crisis Safety Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 transition-all shadow-sm"
              title="Emergency & Safety Circle"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="hidden sm:inline">Safety Circle (988)</span>
            </button>

            {/* Pseudonym handle */}
            <div className="relative">
              {isEditingUser ? (
                <div className="flex items-center space-x-1 bg-[#F4F1EA] p-1 rounded-lg border border-[#D8D4C9]">
                  <input
                    type="text"
                    value={tempUser}
                    onChange={(e) => setTempUser(e.target.value)}
                    className="w-24 px-2 py-0.5 text-xs bg-[#FFFFFF] text-[#1B4326] font-semibold rounded border border-[#D8D4C9] focus:outline-none"
                    placeholder="Username"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveUser}
                    className="px-2 py-0.5 text-xs bg-[#1B4326] text-[#F4F1EA] rounded font-semibold"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingUser(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-[#F4F1EA] text-[#1B4326] hover:bg-[#B9D2B9]/40 border border-[#D8D4C9] transition-all"
                  title="Click to edit anonymous alias"
                >
                  <User className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span className="max-w-[100px] truncate font-semibold">@{username}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Compact Service Navigation Tabs (Only in webapp mode) */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-[#D8D4C9]/70">
          {serviceItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1B4326] text-[#F4F1EA] shadow-sm'
                    : 'text-[#2B2E2B]/80 hover:text-[#1B4326] hover:bg-[#B9D2B9]/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8B87E]' : 'text-[#2E6F40]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
