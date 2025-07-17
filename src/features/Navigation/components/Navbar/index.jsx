import React, { useEffect, useState } from 'react';


/**
 * Navigation Feature Component
 * This component serves as the main entry point for the Navigation feature.
 * It loads a top-level page in an iframe and initializes page navigation helpers
 * for use by embedded applications.
 */
const Navbar = () => {
 
  const [isInitialized, setIsInitialized] = useState(false);

  // Main navigation URL - this is the top-level page that will be loaded
  const NAVIGATION_URL = (typeof window !== 'undefined' ? window.location.origin : '') + '/ui/Search';

  const openPageInNextTab = () => {
    window.top.openPageInNextTab(NAVIGATION_URL, "title");
  };

  return (
    <div className="h-full w-full">
    <button onClick={() => openPageInNextTab() }>Open Navigation</button>
    </div>
  );
};

export default Navbar; 