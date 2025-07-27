import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const OrderCart = ({ cart, cartTotal, onRemoveItem, onCheckout }) => {
  return (
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
                    onClick={() => onRemoveItem(item.id)}
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
          <button className="checkout-btn" onClick={onCheckout}>
            Confirm Checkout
          </button>
        </>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty. Add products to begin.</p>
        </div>
      )}
    </div>
  );
};

export default OrderCart;