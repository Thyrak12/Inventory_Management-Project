import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchableSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Search...",
  name,
  required = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value) => {
    onChange({ target: { name, value } });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="searchable-select">
      <div 
        className="select-input" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || placeholder}
      </div>
      
      {isOpen && (
        <div className="select-dropdown">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="no-results">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;