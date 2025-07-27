// ProductHeader.js
import React from 'react';
import { FaPlus, FaBoxOpen } from 'react-icons/fa';

const ProductHeader = ({ onAddClick }) => (
    <div className="product-header">
        <h1 className="product-header-title">
            <FaBoxOpen className="product-header-icon" /> Product Inventory
        </h1>
        <button className="product-add-btn" onClick={onAddClick}>
            <FaPlus /> Add Product
        </button>
    </div>
);

export default ProductHeader;