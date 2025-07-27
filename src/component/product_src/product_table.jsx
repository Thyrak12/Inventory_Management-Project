// ProductTable.js
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductTable = ({ products, onEdit, onDelete }) => (
    <div className="product-table-container">
        <table className="product-table">
            <thead className="product-table-header">
                <tr>
                    <th className="product-table-header-cell">Name</th>
                    <th className="product-table-header-cell">Description</th>
                    <th className="product-table-header-cell">Category</th>
                    <th className="product-table-header-cell">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.length === 0 ? (
                    <tr className="product-table-row">
                        <td className="product-table-cell" colSpan="4" style={{ textAlign: 'center' }}>
                            No products found matching your criteria
                        </td>
                    </tr>
                ) : (
                    products.map((product) => (
                        <tr className="product-table-row" key={product.id}>
                            <td className="product-table-cell">{product.name}</td>
                            <td className="product-table-cell">{product.description}</td>
                            <td className="product-table-cell">{product.category}</td>
                            <td className="product-table-cell">
                                <button 
                                    className="product-action-btn product-edit-btn" 
                                    onClick={() => onEdit(product)}
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    className="product-action-btn product-delete-btn" 
                                    onClick={() => onDelete(product.id)}
                                >
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