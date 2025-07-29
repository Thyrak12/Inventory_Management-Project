import React from 'react';

const UserFilter = ({ 
  searchTerm, 
  roleFilter,
  onSearchChange, 
  onRoleFilterChange,
  onReset 
}) => {
  return (
    <div className="user-filters-container">
      <div className="user-filter-form">
        <div className="user-filter-group">
          <label className="user-filter-label">Search Users</label>
          <div className="user-search-input-container">
            <input
              type="text"
              className="user-filter-input"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={onSearchChange}
            />
            <span className="user-search-icon">🔍</span>
            {searchTerm && (
              <button
                className="user-clear-search"
                onClick={() => {
                  onSearchChange({ target: { value: '' } });
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="user-filter-group">
          <label className="user-filter-label">Filter by Role</label>
          <select
            className="user-filter-select" 
            value={roleFilter}
            onChange={onRoleFilterChange}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        
        <div className="user-filter-buttons">
          <button
            className="user-filter-reset"
            onClick={onReset}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFilter; 