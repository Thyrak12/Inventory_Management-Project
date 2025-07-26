import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTimes, FaShoppingCart } from 'react-icons/fa';
import '../style/order.css';

const OrdersPage = () => {
  // Product data with prices
  const products = [
    { id: 1, name: 'T-Shirt', price: 19.99 },
    { id: 2, name: 'Jeans', price: 49.99 },
    { id: 3, name: 'Sneakers', price: 89.99 },
    { id: 4, name: 'Hat', price: 24.99 },
    { id: 5, name: 'Jacket', price: 79.99 }
  ];

  const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const [recentOrders, setRecentOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    product: '',
    color: '',
    size: '',
    qty: 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({...newOrder, [name]: value});
  };

  const addToCart = () => {
    if (!newOrder.product || newOrder.qty <= 0) {
      alert('Please fill all required fields');
      return;
    }

    const selectedProduct = products.find(p => p.name === newOrder.product);
    const cartItem = {
      id: Date.now(), // Unique ID for cart item
      ...newOrder,
      price: selectedProduct.price,
      total: (selectedProduct.price * newOrder.qty).toFixed(2)
    };

    setCart([...cart, cartItem]);
    setShowAddModal(false);
    setNewOrder({
      product: '',
      color: '',
      size: '',
      qty: 1
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Generate order IDs
    const lastOrderID = recentOrders.length > 0 ? 
      Math.max(...recentOrders.map(o => o.orderID)) : 1000;
      
    const newOrders = cart.map((item, index) => ({
      orderID: lastOrderID + index + 1,
      date: new Date().toLocaleDateString(),
      ...item,
      status: 'Completed'
    }));

    // Add to recent orders
    setRecentOrders([...newOrders, ...recentOrders]);
    
    // Clear cart
    setCart([]);
    alert('Checkout completed successfully!');
  };

  const filteredOrders = recentOrders.filter(order => 
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderID.toString().includes(searchTerm) ||
    order.date.includes(searchTerm)
  );

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.total), 0).toFixed(2);

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Order Management</h1>
        <button className="add-order-btn" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Add Product
        </button>
      </div>

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

      {/* Checkout Block */}
      <div className="checkout-block">
        <div className="checkout-header">
          <FaShoppingCart className="cart-icon" />
          <h2>Current Sale</h2>
          <span className="cart-count">{cart.length} items</span>
        </div>
        
        {cart.length > 0 ? (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <span className="item-name">{item.product}</span>
                    <span className="item-details">{item.color} | {item.size} | Qty: {item.qty}</span>
                  </div>
                  <div className="item-price">
                    ${item.total}
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">${cartTotal}</span>
            </div>
            <button className="checkout-btn" onClick={checkout}>
              Confirm Checkout
            </button>
          </>
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty. Add products to begin.</p>
          </div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="table-section">
        <h2>Recent Orders</h2>
        <div className="orders-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Product</th>
                <th>Color</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.orderID}>
                  <td>#{order.orderID}</td>
                  <td>{order.date}</td>
                  <td>{order.product}</td>
                  <td>{order.color}</td>
                  <td>{order.size}</td>
                  <td>{order.qty}</td>
                  <td>${order.price.toFixed(2)}</td>
                  <td>${order.total}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Product to Sale</h2>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="form-group">
              <label>Product <span className="required">*</span></label>
              <select
                name="product"
                value={newOrder.product}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name} (${product.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Color</label>
              <select
                name="color"
                value={newOrder.color}
                onChange={handleInputChange}
              >
                <option value="">Select Color</option>
                {colors.map((color, index) => (
                  <option key={index} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Size</label>
              <select
                name="size"
                value={newOrder.size}
                onChange={handleInputChange}
              >
                <option value="">Select Size</option>
                {sizes.map((size, index) => (
                  <option key={index} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity <span className="required">*</span></label>
              <input
                type="number"
                name="qty"
                value={newOrder.qty}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={addToCart}>
                Add to Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;