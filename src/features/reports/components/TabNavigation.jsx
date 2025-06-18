
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';

/**
 * Tab navigation component for filtering reports by category
 * @param {Object} props - Component props
 * @param {Array} props.categories - Array of category names
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.setActiveTab - Function to set active tab
 * @param {Object} props.tabCounts - Object with tab counts
 */
const TabNavigation = ({ categories, activeTab, setActiveTab, tabCounts }) => {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8 overflow-x-auto pb-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeTab === category ? "default" : "ghost"}
            onClick={() => setActiveTab(category)}
            className={`whitespace-nowrap flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === category
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span>{category}</span>
            <span className={`inline-flex items-center justify-center px-2 py-1 text-xs rounded-full ${
              activeTab === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {tabCounts[category] || 0}
            </span>
          </Button>
        ))}
      </nav>
    </div>
  );
};

TabNavigation.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  tabCounts: PropTypes.object.isRequired
};

export default TabNavigation;
