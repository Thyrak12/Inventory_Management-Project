import React from 'react';
import { FaSearch } from 'react-icons/fa';

const OrderFilter = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="controls-bar">
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default OrderFilter;