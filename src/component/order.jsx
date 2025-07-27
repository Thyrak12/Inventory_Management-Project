import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { fetchVariants } from './api/product_var_api.js';
import '../style/order.css';

const SearchableSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Search...",
  name,
  required = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value) => {
    onChange({ target: { name, value } });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="searchable-select">
      <div 
        className="select-input" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || placeholder}
      </div>
      
      {isOpen && (
        <div className="select-dropdown">
          <div className="search-container">
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="no-results">No products found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
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
  const [productVariants, setProductVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProductVariants, setSelectedProductVariants] = useState([]);

  // Fetch product variants from API
  useEffect(() => {
    const loadVariants = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const variants = await fetchVariants();
        setProductVariants(variants);
      } catch (error) {
        console.error('Failed to load product variants:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadVariants();
  }, []);

  // Group variants by product name (unique names only)
  const productNames = [...new Set(productVariants.map(v => v.name))];

  // Create select options with just product names
  const productOptions = productNames.map(name => ({
    value: name,
    label: name
  }));

  // When product is selected, find all its variants
  useEffect(() => {
    if (newOrder.product) {
      const variants = productVariants.filter(v => v.name === newOrder.product);
      setSelectedProductVariants(variants);
      
      // Reset color and size when product changes
      setNewOrder(prev => ({
        ...prev,
        color: '',
        size: ''
      }));
    } else {
      setSelectedProductVariants([]);
    }
  }, [newOrder.product, productVariants]);

  // Get available colors for selected product
  const availableColors = [...new Set(selectedProductVariants.map(v => v.color))];

  // Get available sizes for selected product and color
  const availableSizes = [...new Set(
    selectedProductVariants
      .filter(v => !newOrder.color || v.color === newOrder.color)
      .map(v => v.size)
  )];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({...newOrder, [name]: value});
  };

  const addToCart = () => {
    if (!newOrder.product || !newOrder.color || !newOrder.size || newOrder.qty <= 0) {
      alert('Please fill all required fields');
      return;
    }

    // Find the exact variant
    const selectedVariant = productVariants.find(v => 
      v.name === newOrder.product && 
      v.color === newOrder.color && 
      v.size === newOrder.size
    );

    if (!selectedVariant) {
      alert('Selected product variant not found');
      return;
    }

    const cartItem = {
      id: Date.now(),
      product: selectedVariant.name,
      color: selectedVariant.color,
      size: selectedVariant.size,
      qty: newOrder.qty,
      price: selectedVariant.price || 0,
      total: ((selectedVariant.price || 0) * newOrder.qty).toFixed(2)
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

    const lastOrderID = recentOrders.length > 0 ? 
      Math.max(...recentOrders.map(o => o.orderID)) : 1000;
      
    const newOrders = cart.map((item, index) => ({
      orderID: lastOrderID + index + 1,
      date: new Date().toLocaleDateString(),
      ...item,
      status: 'Completed'
    }));

    setRecentOrders([...newOrders, ...recentOrders]);
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
                  <td>${order.price?.toFixed(2)}</td>
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
            
            {error ? (
              <div className="error-message">{error}</div>
            ) : isLoading ? (
              <div className="loading-spinner">Loading products...</div>
            ) : productOptions.length === 0 ? (
              <div className="no-products">No products available</div>
            ) : (
              <>
                <div className="form-group">
                  <label>Product <span className="required">*</span></label>
                  <SearchableSelect
                    name="product"
                    value={newOrder.product}
                    onChange={handleInputChange}
                    placeholder="Select product"
                    required
                    options={productOptions}
                  />
                </div>

                {newOrder.product && (
                  <>
                    <div className="form-group">
                      <label>Color <span className="required">*</span></label>
                      <select
                        name="color"
                        value={newOrder.color}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Color</option>
                        {availableColors.map((color, index) => (
                          <option key={index} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>

                    {newOrder.color && (
                      <div className="form-group">
                        <label>Size <span className="required">*</span></label>
                        <select
                          name="size"
                          value={newOrder.size}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Size</option>
                          {availableSizes.map((size, index) => (
                            <option key={index} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

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
                  <button 
                    className="confirm-btn" 
                    onClick={addToCart}
                    disabled={!newOrder.product || !newOrder.color || !newOrder.size || newOrder.qty <= 0}
                  >
                    Add to Sale
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;