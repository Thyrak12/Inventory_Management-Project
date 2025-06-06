import React from 'react';
import { FaSearch } from 'react-icons/fa';

const ProductSearchBar = ({ searchTerm, onSearchChange }) => (
    <div className="search-container">
        <FaSearch className="search-icon" />
        <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
        />
    </div>
);

export default ProductSearchBar;
