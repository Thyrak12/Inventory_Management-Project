import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductTable = ({ products, onEdit, onDelete }) => (
    <div className="products-table-container">
        <table className="products-table">
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>
                            No products found matching your criteria
                        </td>
                    </tr>
                ) : (
                    products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.productID}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td className="actions">
                                <button className="action-btn edit-btn" onClick={() => onEdit(product)}>
                                    <FaEdit />
                                </button>
                                <button 
                                    style={{ backgroundColor: 'transparent', color: 'red' }} 
                                    onClick={() => onDelete(product.id)}>
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