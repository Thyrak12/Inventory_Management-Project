import React, { useState } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';

const StockProductModal = ({
  show,
  onClose,
  products,
  onStockProduct,
  isLoading
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  if (!show) return null;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0) return;
    onStockProduct(selectedProduct.id, quantity);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Stock to Product</h2>
          <button className="close-modal" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product</label>
            <div className="searchable-select">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="options-list">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className={`option ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.name} ({product.color}, {product.size}) - Current: {product.stock}
                    </div>
                  ))
                ) : (
                  <div className="no-results">No products found</div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Quantity to Add</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="confirm-btn"
              disabled={!selectedProduct || isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockProductModal;