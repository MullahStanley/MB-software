import React from 'react';
import { 
  Sparkles,
  Compass, 
  Activity, 
  BookOpen, 
  Wind, 
  FileText, 
  Gamepad2, 
  MessageSquareHeart, 
  ShieldAlert, 
  Lock, 
  BarChart3,
  User,
  Home,
  ArrowRight
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
  onOpenTransparency,
  onOpenPro
}) => {
  const [isEditingUser, setIsEditingUser] = React.useState(false);
  const [tempUser, setTempUser] = React.useState(username);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'communities', label: 'Communities', icon: Compass },
    { id: 'checkups', label: 'Patterns & Check-up', icon: Activity },
    { id: 'journal', label: 'Private Journal', icon: BookOpen },
    { id: 'calm', label: 'Breath & Sounds', icon: Wind },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'games', label: 'Calm Games', icon: Gamepad2 },
    { id: 'chat', label: 'Beacon AI', icon: MessageSquareHeart },
    { id: 'analytics', label: 'Impact & Metrics', icon: BarChart3 },
  ];

  const handleSaveUser = () => {
    if (tempUser.trim()) {
      setUsername(tempUser.trim());
    }
    setIsEditingUser(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#D8D4C9] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setCurrentTab('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#1B4326] text-[#F4F1EA] flex items-center justify-center shadow-md border-2 border-[#1B4326] group-hover:bg-[#2E6F40] transition-colors">
              <Sparkles className="w-5 h-5 text-[#C8B87E]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-serif font-bold tracking-tight text-[#1B4326]">
                  Mental Beacon
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#B9D2B9] text-[#1B4326] border border-[#2E6F40]/30">
                  Youth Space 15–35
                </span>
              </div>
              <p className="text-[10px] text-[#2E6F40] font-semibold tracking-wide uppercase hidden sm:block">
                Impact-Driven Social Grounding
              </p>
            </div>
          </div>

          {/* Quick Support & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Context switcher button */}
            {currentTab === 'landing' ? (
              <button
                onClick={() => setCurrentTab('communities')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1B4326] text-[#F4F1EA] hover:bg-[#2E6F40] transition-all shadow-sm"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('landing')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F4F1EA] text-[#1B4326] border border-[#D8D4C9] hover:bg-[#B9D2B9]/30 transition-all shadow-sm"
              >
                <Home className="w-3.5 h-3.5 text-[#2E6F40]" />
                <span>Overview</span>
              </button>
            )}

            {/* Emergency Contacts / Threshold Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-rose-50 text-rose-800 border-2 border-rose-300 hover:bg-rose-100 transition-all shadow-sm"
              title="Trusted Contacts & Safety Escalation"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Safety Circle</span>
            </button>

            {/* Privacy Transparency */}
            <button
              onClick={onOpenTransparency}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-[#2B2E2B] hover:text-[#1B4326] hover:bg-[#F4F1EA] transition-all border border-transparent hover:border-[#D8D4C9]"
              title="Data Transparency & Privacy"
            >
              <Lock className="w-3.5 h-3.5 text-[#2E6F40]" />
              <span className="hidden md:inline">Data Privacy</span>
            </button>

            {/* Sustainability / Pro */}
            <button
              onClick={onOpenPro}
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-[#1B4326] bg-[#B9D2B9]/50 border border-[#2E6F40]/30 hover:bg-[#B9D2B9] transition-all"
            >
              <span>Impact Model</span>
            </button>

            {/* User Pseudonym handle */}
            <div className="relative">
              {isEditingUser ? (
                <div className="flex items-center space-x-1 bg-[#F4F1EA] p-1 rounded-lg border border-[#D8D4C9]">
                  <input
                    type="text"
                    value={tempUser}
                    onChange={(e) => setTempUser(e.target.value)}
                    className="w-28 px-2 py-0.5 text-xs bg-[#FFFFFF] text-[#1B4326] font-semibold rounded border border-[#D8D4C9] focus:outline-none focus:border-[#2E6F40]"
                    placeholder="Username"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveUser}
                    className="px-2 py-0.5 text-xs bg-[#1B4326] hover:bg-[#2E6F40] text-[#F4F1EA] rounded font-semibold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingUser(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-[#F4F1EA] text-[#1B4326] hover:bg-[#B9D2B9]/40 border border-[#D8D4C9] transition-all"
                  title="Click to change anonymous username"
                >
                  <User className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span className="max-w-[110px] truncate font-semibold">@{username}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-[#D8D4C9]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1B4326] text-[#F4F1EA] shadow-sm'
                    : 'text-[#2B2E2B]/80 hover:text-[#1B4326] hover:bg-[#B9D2B9]/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8B87E]' : 'text-[#2E6F40]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
