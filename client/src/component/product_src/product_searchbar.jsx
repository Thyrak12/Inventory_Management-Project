import { FaSearch, FaTimes } from "react-icons/fa";
import React, { useState, useEffect, useRef, useCallback } from "react";

const ProductSearchBar = React.memo(({
  searchTerm = '',
  onSearchChange = () => {},
  onSubmit = () => {},
  onReset = () => {},
  isLoading = false
}) => {
  const [localValue, setLocalValue] = useState(searchTerm);
  const inputRef = useRef(null);

  // Sync with parent when searchTerm changes
  useEffect(() => {
    if (searchTerm !== localValue) {
      setLocalValue(searchTerm);
    }
  }, [searchTerm]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(localValue); // Submit on Enter
      inputRef.current?.blur(); // Optional: remove focus after submit
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onReset();
    inputRef.current?.focus();
  };

  // Maintain cursor position when parent updates value
  useEffect(() => {
    if (inputRef.current && document.activeElement === inputRef.current) {
      const pos = inputRef.current.selectionStart;
      requestAnimationFrame(() => {
        inputRef.current.setSelectionRange(pos, pos);
      });
    }
  }, [localValue]);

  return (
    <div className="product-search-container">
      <div className="product-search-input-container">
        <FaSearch className="product-search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="product-search-input"
          disabled={isLoading}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="product-clear-search"
            aria-label="Clear search"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
});

export default ProductSearchBar;