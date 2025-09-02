
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  RefreshCw, 
  Search, 
  LayoutGrid, 
  List, 
  Kanban, 
  PanelRight
} from 'lucide-react';

const ProposalTableFilters = ({ filters, onFilterChange, view, onViewChange }) => {
  return (
    <div className="filter-controls">
      <div className="filter-controls-group">
        <div className="filter-dropdown-container">
          <select
            className="filter-dropdown"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option>All Proposals</option>
            <option>Open Proposals</option>
            <option>Won Proposals</option>
            <option>Lost Proposals</option>
          </select>
          
          <select 
            className="filter-dropdown"
            value={filters.probability}
            onChange={(e) => onFilterChange('probability', e.target.value)}
          >
            <option>All Probability</option>
            <option>High Probability</option>
            <option>Medium Probability</option>
            <option>Low Probability</option>
          </select>
          
          <select 
            className="filter-dropdown"
            value={filters.assignedRep}
            onChange={(e) => onFilterChange('assignedRep', e.target.value)}
          >
            <option>All Agents</option>
            <option>John Smith</option>
            <option>Jane Doe</option>
            <option>Mike Johnson</option>
          </select>
        </div>
        
        <div className="pagination-info">
          1 - 25 of 150
        </div>
        
        <div className="pagination-buttons">
          <button className="pagination-button" disabled>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="pagination-button">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="action-buttons-group">
        <button className="action-button">
          <RefreshCw className="h-4 w-4" />
        </button>
        
        <button className="action-button">
          <Settings className="h-4 w-4" />
        </button>
        
        <button className="action-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="view-toggle-group">
          <button
            className={`view-toggle-button ${view === 'table' ? 'active' : ''}`}
            onClick={() => onViewChange('table')}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            className={`view-toggle-button ${view === 'cards' ? 'active' : ''}`}
            onClick={() => onViewChange('cards')}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            className={`view-toggle-button ${view === 'kanban' ? 'active' : ''}`}
            onClick={() => onViewChange('kanban')}
          >
            <Kanban className="h-4 w-4" />
          </button>
          <button
            className={`view-toggle-button ${view === 'split' ? 'active' : ''}`}
            onClick={() => onViewChange('split')}
          >
            <PanelRight className="h-4 w-4" />
          </button>
        </div>
        
        <button className="search-button">
          <Search className="h-4 w-4" />
          Filter
        </button>
        
        <button className="views-button">
          Views
        </button>
      </div>
    </div>
  );
};

export default ProposalTableFilters;
