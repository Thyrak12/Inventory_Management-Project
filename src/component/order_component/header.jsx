import React from 'react';
import { FaPlus } from 'react-icons/fa';

const OrderHeader = ({ onAddClick }) => {
  return (
    <div className="page-header">
      <h1>Order Management</h1>
      <button className="add-order-btn" onClick={onAddClick}>
        <FaPlus /> Add Product
      </button>
    </div>
  );
};

export default OrderHeader;