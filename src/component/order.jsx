import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEdit } from 'react-icons/fa';
import './style/order.css';

const OrdersPage = () => {
  // Sample order data with simplified structure
  const [orders, setOrders] = useState([
    { orderID: 1001, productID: 'P001', customer: 'John Smith', qty: 3, total: 149.97 },
    { orderID: 1002, productID: 'P002', customer: 'Sarah Johnson', qty: 5, total: 289.95 },
    { orderID: 1003, productID: 'P003', customer: 'Mike Brown', qty: 2, total: 199.98 },
    { orderID: 1004, productID: 'P004', customer: 'Emily Davis', qty: 1, total: 89.99 },
    { orderID: 1005, productID: 'P005', customer: 'David Wilson', qty: 4, total: 179.96 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    return (
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderID.toString().includes(searchTerm) ||
      order.productID.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="orders-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Order Management</h1>
        <button className="add-order-btn">
          <FaPlus /> Create Order
        </button>
      </div>

      {/* Search Bar */}
      <div className="controls-bar">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product ID</th>
              <th>Customer</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.orderID}>
                <td>#{order.orderID}</td>
                <td>{order.productID}</td>
                <td>{order.customer}</td>
                <td>{order.qty}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <button className="action-btn edit-btn">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-results">
            <p>No orders found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;