import React from 'react';
import NavbarLogo from './NavbarLogo';
import NavbarMenu from './NavbarMenu';
import NavbarSearch from './NavbarSearch';
import NavbarActions from './NavbarActions';
import TabNavigation from '../TabSystem/TabNavigation';
import { useTabs } from '../../context/TabContext';

const Navbar: React.FC = () => {
  const { addTab } = useTabs();

  const handleAdminClick = () => {
    addTab({
      title: 'Admin Dashboard',
      type: 'dynamic',
      component: 'AdminDashboard',
      isCloseable: true
    });
  };

  return (
    <div className="bg-ocean-gradient text-white sticky top-0 z-50 w-full shadow-sm">
      {/* Top navigation bar */}
      <header className="border-b border-white/10">
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <NavbarLogo />
            <NavbarMenu />
          </div>
          
          <div className="flex items-center space-x-4">
            <NavbarSearch />
            <button 
              className="text-white/90 hover:text-white text-sm font-medium px-3 py-1 rounded-sm hover:bg-white/10 transition-colors"
              onClick={handleAdminClick}
            >
              Admin
            </button>
            <NavbarActions />
          </div>
        </div>
      </header>
      
      {/* Tab navigation */}
      <TabNavigation />
    </div>
  );
};

export default Navbar;