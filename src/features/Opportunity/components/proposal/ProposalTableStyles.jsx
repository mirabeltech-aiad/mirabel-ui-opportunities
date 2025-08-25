
import React from 'react';

const ProposalTableStyles = () => (
  <style jsx>{`
    /* Proposals Table Complete Styles */
    .proposals-table-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .filter-controls {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      background-color: white;
    }

    .filter-controls-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

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
      height: 1.75rem;
      width: 1.75rem;
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
    }

    .pagination-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-buttons-group {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .action-button {
      height: 1.75rem;
      min-width: 1.75rem;
      border: 1px solid #e5e7eb;
      background-color: white;
      padding: 0 0.5rem;
      border-radius: 0.375rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-button:hover {
      background-color: #f9fafb;
      border-color: #d1d5db;
    }

    .view-toggle-group {
      display: flex;
      align-items: center;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      overflow: hidden;
    }

    .view-toggle-button {
      height: 1.75rem;
      width: 1.75rem;
      border: none;
      background-color: transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-toggle-button.active {
      background-color: #1f2937;
      color: white;
    }

    .view-toggle-button:not(.active) {
      color: #6b7280;
    }

    .view-toggle-button:not(.active):hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    .search-button {
      background-color: #4fb3ff;
      color: white;
      border: none;
      padding: 0 0.75rem;
      height: 1.75rem;
      border-radius: 0.375rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .search-button:hover {
      background-color: rgba(79, 179, 255, 0.9);
    }

    .views-button {
      border: 1px solid #e5e7eb;
      background-color: white;
      color: #374151;
      padding: 0 0.75rem;
      height: 1.75rem;
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

    .table-container {
      overflow-x: auto;
      max-height: 600px;
    }

    .proposals-table {
      width: 100%;
      min-width: 1200px;
      border-collapse: collapse;
    }

    .table-header {
      background-color: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .table-header th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .table-row {
      border-bottom: 1px solid #f3f4f6;
      transition: background-color 0.15s;
    }

    .table-row:hover {
      background-color: #f9fafb;
    }

    .table-cell {
      padding: 0.625rem 1rem;
      vertical-align: middle;
      font-size: 0.875rem;
      color: #374151;
    }

    .checkbox-input {
      width: 1rem;
      height: 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      cursor: pointer;
    }

    .edit-button {
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: background-color 0.15s;
      cursor: pointer;
      border: none;
      background: transparent;
    }

    .edit-button:hover {
      background-color: #f3f4f6;
    }

    .rep-avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .filter-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      
      .filter-controls-group,
      .action-buttons-group {
        justify-content: center;
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
    }
  `}</style>
);

export default ProposalTableStyles;
