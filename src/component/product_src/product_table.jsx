import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const getStockStatus = (stock) => {
    if (stock > 10) return 'In Stock';
    if (stock > 0) return 'Low Stock';
    return 'Out of Stock';
};

const ProductTable = ({ products, onEdit, onDelete }) => (
    <div className="products-table-container">
        <table className="products-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>
                            No products found matching your criteria
                        </td>
                    </tr>
                ) : (
                    products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.sku}</td>
                            <td>{product.category}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <span className={`status-badge ${getStockStatus(product.quantity).replace(/\s+/g, '-').toLowerCase()}`}>
                                    {getStockStatus(product.quantity)}
                                </span>
                            </td>
                            <td className="actions">
                                <button className="action-btn edit-btn" onClick={() => onEdit(product)}>
                                    <FaEdit />
                                </button>
                                <button style={{ backgroundColor: 'transparent', color: 'red' }} onClick={() => onDelete(product._id)}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);

export default ProductTable;
