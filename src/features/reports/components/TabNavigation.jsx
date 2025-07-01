import React from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

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
    <div>
      <nav className="flex overflow-x-auto gap-1 pb-1 sm:gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeTab === category ? "default" : "ghost"}
            onClick={() => setActiveTab(category)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap border border-gray-300 ${
              activeTab === category
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {category === "Favorites" && (
              <Star className="mr-1 w-3 h-3 fill-current sm:w-4 sm:h-4" />
            )}
            <span>{category}</span>
            <span
              className={`inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${
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
