import React, { useState, useEffect } from "react";
import '../../style/stock.css';

const EditVariantModal = ({ 
  show, 
  onClose, 
  variant, 
  onSubmit, 
  isLoading,
  availableColors = [],
  availableSizes = []
}) => {
  const [editedVariant, setEditedVariant] = useState({
    color: '',
    size: '',
    price: 0,
    qty: 0
  });

  useEffect(() => {
    if (variant) {
      setEditedVariant({
        color: variant.color || '',
        size: variant.size || '',
        price: variant.price || 0,
        qty: variant.qty || 0
      });
    }
  }, [variant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...variant,
      ...editedVariant
    });
  };

  if (!show) return null;

  return (
    <div className="stock-modal-overlay">
      <div className="stock-modal">
        <div className="stock-modal-header">
          <h2 className="stock-modal-title">Edit Variant</h2>
          <button 
            onClick={onClose} 
            className="stock-modal-close"
            disabled={isLoading}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="stock-modal-body">
          <div className="stock-form-group">
            <label className="stock-form-label">Color</label>
            <select
              value={editedVariant.color}
              onChange={(e) => setEditedVariant({
                ...editedVariant,
                color: e.target.value
              })}
              className="stock-form-input"
              required
            >
              <option value="">Select Color</option>
              {availableColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className="stock-form-group">
            <label className="stock-form-label">Size</label>
            <select
              value={editedVariant.size}
              onChange={(e) => setEditedVariant({
                ...editedVariant,
                size: e.target.value
              })}
              className="stock-form-input"
              required
            >
              <option value="">Select Size</option>
              {availableSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="stock-form-group-price">
            <label className="stock-form-label">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editedVariant.price}
              onChange={(e) => setEditedVariant({
                ...editedVariant,
                price: parseFloat(e.target.value) || 0
              })}
              className="stock-form-input"
              required
            />
          </div>

          <div className="stock-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="stock-modal-button stock-modal-cancel"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="stock-modal-button stock-modal-save"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVariantModal;