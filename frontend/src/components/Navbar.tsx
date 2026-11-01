import React from 'react';
import { 
  Compass, 
  Activity, 
  BookOpen, 
  Wind, 
  Headphones, 
  FileText, 
  Gamepad2, 
  MessageSquareHeart, 
  ShieldAlert, 
  Lock, 
  Sparkles,
  BarChart3,
  User
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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('communities')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-300 via-emerald-200 to-teal-400 bg-clip-text text-transparent">
                Mental Beacon
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Youth Space 15–35
              </span>
            </div>
          </div>

          {/* Quick Support & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Emergency Contacts / Threshold Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all shadow-sm"
              title="Trusted Contacts & Safety Escalation"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Safety Circle</span>
            </button>

            {/* Privacy Transparency */}
            <button
              onClick={onOpenTransparency}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700"
              title="Data Transparency & Privacy"
            >
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">Data Privacy</span>
            </button>

            {/* Sustainability / Pro */}
            <button
              onClick={onOpenPro}
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
            >
              <span>Impact Model</span>
            </button>

            {/* User Pseudonym handle */}
            <div className="relative">
              {isEditingUser ? (
                <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                  <input
                    type="text"
                    value={tempUser}
                    onChange={(e) => setTempUser(e.target.value)}
                    className="w-28 px-2 py-0.5 text-xs bg-slate-900 text-teal-300 rounded border border-slate-700 focus:outline-none"
                    placeholder="Username"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveUser}
                    className="px-2 py-0.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingUser(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:text-teal-300 hover:bg-slate-750 border border-slate-700/80 transition-all"
                  title="Click to change anonymous username"
                >
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span className="max-w-[100px] truncate font-medium">@{username}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
