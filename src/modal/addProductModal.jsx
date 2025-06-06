import React from 'react';
import { FaTimes } from 'react-icons/fa';

const AddProductModal = ({ newProduct, setNewProduct, onClose, onSubmit }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Product</h2>
                    <button className="close-modal" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Enter product name"
                    />
                </div>

                <div className="form-group">
                    <label>SKU</label>
                    <input
                        type="text"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        placeholder="Enter SKU"
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        placeholder="Enter category"
                    />
                </div>


                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        placeholder="Enter stock quantity"
                        min="0"
                    />
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="confirm-btn" onClick={onSubmit}>
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
