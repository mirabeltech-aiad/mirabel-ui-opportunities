import React from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";

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
    <div className="mb-6">
      <nav className="flex overflow-x-auto gap-2 pb-1">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeTab === category ? "default" : "ghost"}
            onClick={() => setActiveTab(category)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap border border-gray-300 ${
              activeTab === category
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <span>{category}</span>
            <span
              className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${
                activeTab === category
                  ? "bg-blue-500/50 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
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
  tabCounts: PropTypes.object.isRequired,
};

export default TabNavigation;
