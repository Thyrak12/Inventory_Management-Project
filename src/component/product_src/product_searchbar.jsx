import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const ProductSearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  categories = [], 
  selectedCategory 
}) => {
  const handleSearch = (e) => {
    e.preventDefault();
    onSearchChange(searchTerm, selectedCategory);
  };

  const handleClearSearch = () => {
    onSearchChange('', '');
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value, selectedCategory)}
            className="search-input"
          />
          {(searchTerm || selectedCategory) && (
            <button 
              type="button"
              onClick={handleClearSearch}
              className="clear-search-button"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => onSearchChange(searchTerm, e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default ProductSearchBar;