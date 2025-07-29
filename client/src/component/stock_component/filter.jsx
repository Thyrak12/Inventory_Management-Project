import { FaSearch, FaTimes } from "react-icons/fa";
import React, { useState } from "react";
import '../../style/stock.css';

const StockFilters = ({
  searchTerm,
  sizeFilter,
  colorFilter,
  priceRange,
  availableSizes,
  availableColors,
  onFilterChange,
  onReset
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  
  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange({
      search: localSearch,
      size: sizeFilter,
      color: colorFilter,
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString()
    });
  };

  return (
    <div className="stock-filters-container">
      <form onSubmit={handleSearch} className="stock-filter-form">
        <div className="stock-filter-group stock-search-container">
          <label className="stock-filter-label">Search</label>
          <input
            type="text"
            placeholder="Search variants..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="stock-filter-input"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                onFilterChange({
                  search: '',
                  size: sizeFilter,
                  color: colorFilter,
                  minPrice: priceRange[0].toString(),
                  maxPrice: priceRange[1].toString()
                });
              }}
              className="stock-clear-search"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="stock-filter-group">
          <label className="stock-filter-label">Size</label>
          <select
            value={sizeFilter}
            onChange={(e) => onFilterChange({
              search: searchTerm,
              size: e.target.value,
              color: colorFilter,
              minPrice: priceRange[0].toString(),
              maxPrice: priceRange[1].toString()
            })}
            className="stock-filter-input"
          >
            <option value="">All Sizes</option>
            {availableSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="stock-filter-group">
          <label className="stock-filter-label">Color</label>
          <select
            value={colorFilter}
            onChange={(e) => onFilterChange({
              search: searchTerm,
              size: sizeFilter,
              color: e.target.value,
              minPrice: priceRange[0].toString(),
              maxPrice: priceRange[1].toString()
            })}
            className="stock-filter-input"
          >
            <option value="">All Colors</option>
            {availableColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div className="stock-filter-group">
          <label className="stock-filter-label">Price Range</label>
          <div className="stock-range-container">
            <span className="stock-range-value">${priceRange[0]}</span>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[0]}
              onChange={(e) => onFilterChange({
                search: searchTerm,
                size: sizeFilter,
                color: colorFilter,
                minPrice: e.target.value,
                maxPrice: priceRange[1].toString()
              })}
              className="stock-range-input"
            />
            <span className="stock-range-value">${priceRange[1]}</span>
          </div>
        </div>

        <div className="stock-filter-buttons">
          <button
            type="button"
            onClick={onReset}
            className="stock-filter-button stock-filter-reset"
          >
            Reset
          </button>
          <button
            type="submit"
            className="stock-filter-button stock-filter-apply"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockFilters;