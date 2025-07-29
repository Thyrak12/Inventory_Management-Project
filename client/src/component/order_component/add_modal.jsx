import React from 'react';
import { FaTimes } from 'react-icons/fa';
import SearchableSelect from './searchable';

const AddProductModal = ({
  show,
  onClose,
  newOrder,
  onInputChange,
  onAddToCart,
  productOptions,
  availableColors,
  availableSizes,
  error,
  isLoading,
  hasProducts
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Product to Sale</h2>
          <button className="close-modal" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        {error ? (
          <div className="error-message">{error}</div>
        ) : isLoading ? (
          <div className="loading-spinner">Loading products...</div>
        ) : !hasProducts ? (
          <div className="no-products">No products available</div>
        ) : (
          <>
            <div className="form-group">
              <label>Product <span className="required">*</span></label>
              <SearchableSelect
                name="product"
                value={newOrder.product}
                onChange={onInputChange}
                placeholder="Select product"
                required
                options={productOptions}
              />
            </div>

            {newOrder.product && (
              <>
                <div className="form-group">
                  <label>Color <span className="required">*</span></label>
                  <select
                    name="color"
                    value={newOrder.color}
                    onChange={onInputChange}
                    required
                  >
                    <option value="">Select Color</option>
                    {availableColors.map((color, index) => (
                      <option key={index} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {newOrder.color && (
                  <div className="form-group">
                    <label>Size <span className="required">*</span></label>
                    <select
                      name="size"
                      value={newOrder.size}
                      onChange={onInputChange}
                      required
                    >
                      <option value="">Select Size</option>
                      {availableSizes.map((size, index) => (
                        <option key={index} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label>Quantity <span className="required">*</span></label>
              <input
                type="number"
                name="qty"
                value={newOrder.qty}
                onChange={onInputChange}
                min="1"
                required
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={onAddToCart}
                disabled={!newOrder.product || !newOrder.color || !newOrder.size || newOrder.qty <= 0}
              >
                Add to Sale
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;