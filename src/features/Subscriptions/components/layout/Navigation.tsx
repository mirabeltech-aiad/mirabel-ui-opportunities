
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const rightNavItems = [
    { id: 'circulation', label: 'Circulation Dashboard', path: '/subscriptions/circulation' },
    { id: 'analytics', label: 'Subscriber Dashboard', path: '/subscriptions/analytics' },
    { id: 'reports', label: 'Reports', path: '/subscriptions/reports' },
    { id: 'admin', label: 'Admin', path: '/subscriptions/admin' },
    { id: 'settings', label: 'Settings', path: '/subscriptions/settings' }
  ];

  const allNavItems = [...rightNavItems];

  const handleNavigation = (tab: string) => {
    const navItem = rightNavItems.find(item => item.id === tab);
    if (navItem) {
      navigate(navItem.path);
    } else {
      onTabChange(tab);
    }
  };

  return (
    <header className="bg-ocean-gradient text-white border-b border-gray-200 sticky top-0 z-50 w-full shadow-sm">
      <div className="w-full px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white text-ocean-800 rounded-sm flex items-center justify-center">
              <span className="font-bold text-lg">L</span>
            </div>
            <h1 className="text-xl font-bold text-white">
              Lovable Template Site
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden lg:flex items-center space-x-1">
            <button 
              onClick={() => handleNavigation('/subscriptions/circulation')}
              className={`text-white font-medium transition-colors px-3 py-1 rounded text-sm ${
                activeTab === 'circulation'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Circulation Dashboard
            </button>
            
            <button 
              onClick={() => handleNavigation('analytics')}
              className={`text-white font-medium transition-colors px-3 py-1 rounded text-sm ${
                activeTab === 'analytics'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Subscriber Dashboard
            </button>

            <button 
              onClick={() => handleNavigation('pricing')}
              className={`text-white font-medium transition-colors px-3 py-1 rounded text-sm ${
                activeTab === 'pricing'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Pricing
            </button>

            <button 
              onClick={() => handleNavigation('reports')}
              className={`text-white font-medium transition-colors px-3 py-1 rounded text-sm ${
                activeTab === 'reports'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Reports
            </button>

            <div className="relative flex items-center h-full mx-2">
              <div className="absolute inset-y-auto left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/70" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="h-8 bg-white/10 border border-white/30 rounded-md pl-9 pr-3 py-1 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/40"
                onClick={() => setOpen(true)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:flex h-5 items-center gap-1 rounded border border-white/30 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/70">
                  <span className="text-xs">⌘K</span>
                </kbd>
              </div>
            </div>

            <button 
              onClick={() => handleNavigation('admin')}
              className={`text-white font-medium transition-colors px-3 py-1 rounded text-sm ${
                activeTab === 'admin'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Admin
            </button>
          </nav>

          <div className="hidden lg:flex items-center space-x-2 ml-4">
            <button 
              onClick={() => handleNavigation('settings')}
              className={`text-white font-medium transition-colors p-2 rounded ${
                activeTab === 'settings'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
          
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Pages">
                {allNavItems.map((item) => (
                  <CommandItem key={item.id} onSelect={() => {
                    handleNavigation(item.id);
                    setOpen(false);
                  }}>
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>

          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 px-2 py-0 h-8">
            Help ?
          </Button>
          
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-ocean-800 font-bold">
            !
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
