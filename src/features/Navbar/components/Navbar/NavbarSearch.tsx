import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { 
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

const NavbarSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  
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

  return (
    <>
      <div className="relative flex items-center h-full">
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
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => setOpen(false)}>
              <span>Overview</span>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <span>Services</span>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <span>Auth Keys</span>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <span>Documentation</span>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <span>Help Guide</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default NavbarSearch;