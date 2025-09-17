import React from 'react';

const DataTable = ({ data, filters, loading }) => {
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'value', label: 'Value', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return `$${value.toLocaleString()}`;
    }
    return value;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="data-table-loading">Loading table data...</div>;
  }

  return (
    <div className="data-table">
      <div className="data-table__header">
        <h3>Search Results ({data.length} items)</h3>
      </div>
      
      <div className="data-table__container">
        <table className="table">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.key} className={column.sortable ? 'sortable' : ''}>
                  {column.label}
                  {column.sortable && <span className="sort-icon">↕</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No results found
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>
                    <span className={`badge badge--${row.type?.toLowerCase()}`}>
                      {row.type}
                    </span>
                  </td>
                  <td>
                    <span className={`status status--${row.status?.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{formatValue(row.value)}</td>
                  <td>{formatDate(row.date)}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn--small btn--primary">View</button>
                      <button className="btn btn--small btn--secondary">Edit</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;