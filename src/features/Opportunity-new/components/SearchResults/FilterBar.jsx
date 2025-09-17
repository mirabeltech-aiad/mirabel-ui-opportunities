import React from 'react';

const FilterBar = ({ filters, onFilterChange, onExport }) => {
  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

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