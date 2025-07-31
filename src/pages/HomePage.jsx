import React from 'react';
import Home from '../features/Home';

/**
 * HomePage - Standard page-level entry point for the Home feature
 * This follows standard practice of having page components in pages folder
 * that serve as entry points to feature modules
 */
const HomePage = () => {
  React.useEffect(() => {
    //Dynamically create and bind a script tag
    const script = document.createElement('script');
    script.src = `${getTopPath()}/intranet/localizer.js.axd?v=5.24.2`; // <-- Replace with actual script path
    script.async = true;
    document.body.appendChild(script);

   
    // Optional: Clean up the script tag on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return <Home />;
};

export default HomePage;