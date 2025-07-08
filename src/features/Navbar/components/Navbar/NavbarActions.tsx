import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, User } from 'lucide-react';

const NavbarActions: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white hover:bg-white/10 p-2 h-8 w-8"
      >
        <HelpCircle size={18} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white hover:bg-white/10 p-2 h-8 w-8"
      >
        <User size={18} />
      </Button>
    </div>
  );
};

export default NavbarActions;