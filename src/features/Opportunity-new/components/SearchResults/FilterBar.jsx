import React from 'react';
import { Grid3X3, List } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, onExport, viewMode = 'table', onViewChange }) => {
  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  // Inject styles
  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('filter-bar-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'filter-bar-styles';
      styleSheet.textContent = `
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .filter-bar__left {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .filter-bar__right {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .filter-select {
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        
        .view-toggle {
          display: flex;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
        }
        
        .view-toggle__btn {
          padding: 0.5rem;
          background: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        
        .view-toggle__btn:hover {
          background-color: #f3f4f6;
        }
        
        .view-toggle__btn--active {
          background-color: #3b82f6;
          color: white;
        }
        
        .view-toggle__btn--active:hover {
          background-color: #2563eb;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .btn--secondary {
          background-color: #6b7280;
          color: white;
          border: none;
        }
        
        .btn--secondary:hover {
          background-color: #4b5563;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return (
    <div className="filter-bar">
      <div className="filter-bar__left">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select 
            id="status-filter"
            value={filters.status} 
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">Sort by:</label>
          <select 
            id="sort-filter"
            value={filters.sortBy} 
            onChange={handleSortChange}
            className="filter-select"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="value">Value</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="filter-bar__right">
        {/* View Mode Toggle */}
        <div className="view-toggle">
          <button
            onClick={() => onViewChange?.('table')}
            className={`view-toggle__btn ${viewMode === 'table' ? 'view-toggle__btn--active' : ''}`}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange?.('cards')}
            className={`view-toggle__btn ${viewMode === 'cards' ? 'view-toggle__btn--active' : ''}`}
            title="Card View"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
        </div>

        <button 
          onClick={onExport}
          className="btn btn--secondary"
        >
          Export Results
        </button>
      </div>
    </div>
  );
};

export default FilterBar;