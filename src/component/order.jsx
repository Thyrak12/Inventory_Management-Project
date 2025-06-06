import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTimes } from 'react-icons/fa';
import '../style/order.css';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    productID: '',
    customer: '',
    qty: 1,
    total: 0
  });

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    return (
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderID.toString().includes(searchTerm) ||
      order.productID.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle create order
  const handleCreateOrder = () => {
    if (!newOrder.productID || !newOrder.customer || newOrder.qty <= 0) {
      alert('Please fill all required fields with valid values');
      return;
    }

    const order = {
      orderID: orders.length > 0 ? Math.max(...orders.map(o => o.orderID)) + 1 : 1001,
      productID: newOrder.productID,
      customer: newOrder.customer,
      qty: parseInt(newOrder.qty),
      total: parseFloat(newOrder.total)
    };

    setOrders([...orders, order]);
    setShowAddModal(false);
    setNewOrder({
      productID: '',
      customer: '',
      qty: 1,
      total: 0
    });
  };

  // Calculate total when quantity changes
  const handleQtyChange = (e) => {
    const qty = parseInt(e.target.value) || 0;
    const unitPrice = 49.99; // Example unit price - you might want to make this dynamic
    const total = qty * unitPrice;
    
    setNewOrder({
      ...newOrder,
      qty: qty,
      total: total
    });
  };

  return (
    <div className="orders-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Order Management</h1>
        <button className="add-order-btn" onClick={() => setShowAddModal(true)}>
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

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Order</h2>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="form-group">
              <label>Product ID <span className="required">*</span></label>
              <input
                type="text"
                value={newOrder.productID}
                onChange={(e) => setNewOrder({...newOrder, productID: e.target.value})}
                placeholder="Enter product ID"
                required
              />
            </div>
            <div className="form-group">
              <label>Customer Name <span className="required">*</span></label>
              <input
                type="text"
                value={newOrder.customer}
                onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity <span className="required">*</span></label>
              <input
                type="number"
                value={newOrder.qty}
                onChange={handleQtyChange}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>Total Price</label>
              <input
                type="number"
                value={newOrder.total.toFixed(2)}
                readOnly
                className="read-only"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleCreateOrder}>
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;