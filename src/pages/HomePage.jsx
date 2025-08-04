import React from 'react';
import Home from '../features/Home';
import { getTopPath } from '../utils/commonHelpers';


/**
 * HomePage - Standard page-level entry point for the Home feature
 * This follows standard practice of having page components in pages folder
 * that serve as entry points to feature modules
 */
const HomePage = () => {
  return <Home />;
};

export default HomePage;