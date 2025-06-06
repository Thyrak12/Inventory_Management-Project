import React from 'react';
import { FaPlus, FaBoxOpen } from 'react-icons/fa';

const ProductHeader = ({ onAddClick }) => (
    <div className="page-header">
        <h1>
            <FaBoxOpen className="header-icon" /> Product Inventory
        </h1>
        <button className="add-product-btn" onClick={onAddClick}>
            <FaPlus /> Add Product
        </button>
    </div>
);

export default ProductHeader;
