import React, { useState, useEffect } from "react";
import '../../style/stock.css';

const EditVariantModal = ({ show, onClose, variant, onSubmit, isLoading }) => {
  const [editedVariant, setEditedVariant] = useState(variant || {});

  useEffect(() => {
    if (variant) {
      setEditedVariant(variant);
    }
  }, [variant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedVariant);
  };

  if (!show) return null;

  return (
    <div className="stock-modal-overlay">
      <div className="stock-modal">
        <div className="stock-modal-header">
          <h2 className="stock-modal-title">Edit Variant</h2>
          <button onClick={onClose} className="stock-modal-close">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="stock-modal-body">
          <div className="stock-form-group">
            <label className="stock-form-label">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editedVariant.price || ''}
              onChange={(e) => setEditedVariant({
                ...editedVariant,
                price: parseFloat(e.target.value) || 0
              })}
              className="stock-form-input"
              required
            />
          </div>
          <div className="stock-form-group">
            <label className="stock-form-label">Quantity</label>
            <input
              type="number"
              min="0"
              value={editedVariant.qty || ''}
              onChange={(e) => setEditedVariant({
                ...editedVariant,
                qty: parseInt(e.target.value) || 0
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