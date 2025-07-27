import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../style/modal.css';

const UpdateProductModal = ({ 
  show,
  onClose, 
  product, 
  onChange, 
  onSubmit,
  isLoading
}) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Product</h2>
          <button 
            className="close-modal" 
            onClick={onClose}
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="productID">Product ID *</label>
            <input
              id="productID"
              type="text"
              name="productID"
              value={product.productID}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="3"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              id="category"
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button"
              className="cancel-btn" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="confirm-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;