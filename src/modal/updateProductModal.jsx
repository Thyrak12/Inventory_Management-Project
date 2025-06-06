import React from 'react';
import '../style/modal.css';

const UpdateProductModal = ({ onClose, newProduct, setNewProduct, onSubmit }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Update Product</h2>
        <form onSubmit={onSubmit} className="modal-form">
          <label>
            Name:
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </label>
          <label>
            SKU:
            <input
              type="text"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              required
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="submit" className="submit-btn">Update</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
