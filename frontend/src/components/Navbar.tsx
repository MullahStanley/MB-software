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
  BarChart3,
  User,
  Check,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  username: string;
  setUsername: (name: string) => void;
  onOpenTransparency: () => void;
  onOpenPro: () => void;
}

const MAIN_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'approach', label: 'Our Approach' },
  { id: 'mbcare', label: 'MB Care' },
  { id: 'booking', label: 'Booking' },
  { id: 'underdev', label: 'Resources' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, username, setUsername }) => {
  const isService = !['home', 'approach', 'mbcare', 'booking', 'underdev'].includes(currentTab);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isEditingUser, setIsEditingUser] = React.useState(false);
  const [tempUser, setTempUser] = React.useState(username);

  const handleSaveUser = () => {
    if (tempUser.trim()) setUsername(tempUser.trim());
    setIsEditingUser(false);
  };

  if (isService) {
    // keep existing service header
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
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D8D4C9] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setCurrentTab('home')} className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Mental Beacon" className="h-8 w-auto" />
            </button>
            <button onClick={() => setCurrentTab('home')} className="text-xs font-semibold text-[#2E6F40] hover:text-[#1B4326]">
              ← Home
            </button>
            <div className="flex items-center gap-2">
              {isEditingUser ? (
                <div className="flex items-center gap-1 bg-[#F4F1EA] p-1 rounded-lg border border-[#D8D4C9]">
                  <input value={tempUser} onChange={(e) => setTempUser(e.target.value)} className="w-24 px-2 py-0.5 text-xs bg-white text-[#1B4326] font-semibold rounded border border-[#D8D4C9]" autoFocus />
                  <button onClick={handleSaveUser} className="px-2 py-0.5 text-xs bg-[#1B4326] text-[#F4F1EA] rounded"><Check className="w-3 h-3" /></button>
                </div>
              ) : (
                <button onClick={() => setIsEditingUser(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-[#F4F1EA] text-[#1B4326] border border-[#D8D4C9]">
                  <User className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span className="max-w-[100px] truncate font-semibold">@{username}</span>
                </button>
              )}
            </div>
          </div>
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-[#D8D4C9]/70">
            {serviceItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button key={item.id} onClick={() => setCurrentTab(item.id)} className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${isActive ? 'bg-[#1B4326] text-[#F4F1EA]' : 'text-[#2B2E2B]/80 hover:text-[#1B4326] hover:bg-[#B9D2B9]/30'}`}>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8B87E]' : 'text-[#2E6F40]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#D8D4C9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setCurrentTab('home')} className="flex items-center gap-2 group">
            <img src="/images/logo.png" alt="Mental Beacon" className="h-9 w-auto transition-transform group-hover:scale-105" />
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {MAIN_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => setCurrentTab(l.id)}
                className={`relative text-sm font-semibold transition-colors ${currentTab === l.id ? 'text-[#1B4326]' : 'text-[#2B2E2B]/70 hover:text-[#1B4326]'}`}
              >
                {l.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#1B4326] transition-all duration-300 ${currentTab === l.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('booking')}
              className="hidden sm:inline-flex px-4 py-2 rounded-full bg-[#1B4326] text-[#F4F1EA] text-xs font-semibold hover:bg-[#2E6F40] transition-all"
            >
              Book a session
            </button>
            <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-page-in">
            {MAIN_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => { setCurrentTab(l.id); setMobileOpen(false); }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${currentTab === l.id ? 'bg-[#1B4326] text-[#F4F1EA]' : 'text-[#2B2E2B] hover:bg-[#B9D2B9]/30'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
