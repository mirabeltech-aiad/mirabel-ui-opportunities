
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyStylesButton = () => {
  const [copied, setCopied] = useState(false);

  const cssCode = `/* Opportunities Table Filter Controls Complete Styles */
.opportunities-table-filters {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background-color: white;
}

/* Filter Controls Group */
.filter-controls-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

/* Combined Filter Dropdown Container */
.filter-dropdown-container {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
}

.filter-dropdown {
  background-color: white;
  padding: 0.5rem;
  font-size: 0.875rem;
  border-right: 1px solid #d1d5db;
  outline: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-dropdown:hover {
  background-color: #f9fafb;
}

.filter-dropdown:last-child {
  border-right: none;
}

.filter-dropdown:focus {
  background-color: #eff6ff;
  box-shadow: 0 0 0 2px #4fb3ff;
}

/* Pagination Controls */
.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0.5rem;
}

.pagination-buttons {
  display: flex;
  gap: 0.25rem;
}

.pagination-button {
  height: 2rem;
  width: 2rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 0.375rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Action Buttons Group */
.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Individual Action Buttons */
.action-button {
  border: 1px solid #e5e7eb;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  height: 2rem;
  min-width: 2rem;
}

.action-button:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.action-button:focus {
  outline: none;
  ring: 2px solid #4fb3ff;
  ring-offset: 2px;
}

/* View Toggle Button Group */
.view-toggle-group {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
}

.view-toggle-button {
  height: 2rem;
  width: 2rem;
  border: none;
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0;
}

.view-toggle-button.active {
  background-color: #1f2937;
  color: white;
}

.view-toggle-button:not(.active) {
  background-color: transparent;
  color: #6b7280;
}

.view-toggle-button:not(.active):hover {
  background-color: #f3f4f6;
  color: #374151;
}

.view-toggle-button:focus {
  outline: none;
  z-index: 1;
  box-shadow: 0 0 0 2px #4fb3ff;
}

/* Search Button */
.search-button {
  background-color: #4fb3ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.search-button:hover {
  background-color: rgba(79, 179, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-button:focus {
  outline: none;
  ring: 2px solid #4fb3ff;
  ring-offset: 2px;
}

.search-button:active {
  transform: translateY(0);
}

/* Views Button */
.views-button {
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #374151;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.views-button:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.views-button:focus {
  outline: none;
  ring: 2px solid #4fb3ff;
  ring-offset: 2px;
}

/* Icon Styles */
.filter-icon {
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
}

.button-icon {
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
}

/* Utility Classes */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Loading State */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .opportunities-table-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-controls-group,
  .action-buttons-group {
    justify-content: center;
    width: 100%;
  }
  
  .filter-dropdown-container {
    flex-direction: column;
  }
  
  .filter-dropdown {
    border-right: none;
    border-bottom: 1px solid #d1d5db;
  }
  
  .filter-dropdown:last-child {
    border-bottom: none;
  }
  
  .pagination-info {
    text-align: center;
  }
  
  .view-toggle-group {
    justify-content: center;
  }
  
  .search-button,
  .views-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .opportunities-table-filters {
    padding: 0.75rem;
  }
  
  .action-buttons-group {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .action-button {
    flex: 1;
    min-width: 2.5rem;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .opportunities-table-filters {
    background-color: #1f2937;
    border-bottom-color: #374151;
  }
  
  .filter-dropdown {
    background-color: #374151;
    color: white;
    border-color: #4b5563;
  }
  
  .filter-dropdown:hover {
    background-color: #4b5563;
  }
  
  .action-button,
  .views-button {
    background-color: #374151;
    color: white;
    border-color: #4b5563;
  }
  
  .action-button:hover,
  .views-button:hover {
    background-color: #4b5563;
  }
  
  .pagination-info {
    color: #d1d5db;
  }
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy styles:', err);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Table Filter Controls Styles
        </h3>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#4fb3ff] rounded-md hover:bg-[#4fb3ff]/90 focus:outline-none focus:ring-2 focus:ring-[#4fb3ff] focus:ring-offset-2 transition-all duration-200"
        >
          {copied ? (
            <Check className="h-4 w-4 text-white" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy All Styles'}
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Complete CSS stylesheet for opportunities table filter controls including responsive design and dark mode support.
      </p>
    </div>
  );
};

export default CopyStylesButton;
