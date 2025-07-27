import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';

const StockProductModal = ({
  show,
  onClose,
  products,
  onStockUpdate,
  isLoading
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [action, setAction] = useState('add'); // 'add' or 'set'

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setSelectedProduct(null);
      setQuantity('');
      setSearchTerm('');
      setError('');
      setAction('add');
    }
  }, [show]);

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.color.toLowerCase().includes(searchLower) ||
      product.size.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty)) {
      setError('Please enter a valid number');
      return;
    }

    if (action === 'add' && qty <= 0) {
      setError('Quantity to add must be positive');
      return;
    }

    if (action === 'set' && qty < 0) {
      setError('Stock cannot be negative');
      return;
    }

    try {
      await onStockUpdate(selectedProduct.id, qty, action);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update stock');
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Product Stock</h2>
          <button className="close-modal" onClick={onClose} disabled={isLoading}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Selection</label>
            <div className="searchable-select">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="options-list">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`option ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                    onClick={() => !isLoading && setSelectedProduct(product)}
                  >
                    {product.name} ({product.color}, {product.size}) - Current: {product.stock}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Action</label>
            <div className="action-buttons">
              <button
                type="button"
                className={`action-btn ${action === 'add' ? 'active' : ''}`}
                onClick={() => setAction('add')}
              >
                Add to Stock
              </button>
              <button
                type="button"
                className={`action-btn ${action === 'set' ? 'active' : ''}`}
                onClick={() => setAction('set')}
              >
                Set Stock
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>{action === 'add' ? 'Quantity to Add' : 'New Stock Quantity'}</label>
            <input
              type="number"
              min={action === 'add' ? '1' : '0'}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn cancel-btn" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn confirm-btn"
              disabled={isLoading || !selectedProduct || !quantity}
            >
              {isLoading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockProductModal;