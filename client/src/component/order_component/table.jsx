import React from 'react';

const OrdersTable = ({ orders }) => {
  // Helper function to format price
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '$0.00';
    const num = typeof price === 'string' ? parseFloat(price) : Number(price);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  const formatText = (text) => {
    return text === undefined || text === null ? 'N/A' : text;
  };

  // Generate a unique key for each order
  const getOrderKey = (order, index) => {
    // Use orderID if available, otherwise fall back to index
    return order.id ? `order-${order.id}` : `order-${index}`;
  };

  return (
    <div className="table-section">
      <h2>Recent Orders</h2>
      <div className="orders-table-container">
        <table className="data-table">
          <thead>
            <tr>
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
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={getOrderKey(order, index)}>
                  <td>{formatText(order.date)}</td>
                  <td>{formatText(order.product)}</td>
                  <td>{formatText(order.color)}</td>
                  <td>{formatText(order.size)}</td>
                  <td>{formatText(order.qty)}</td>
                  <td>{formatPrice(order.price)}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>
                    <span className={`status-badge ${order.status?.toLowerCase() || 'completed'}`}>
                      {formatText(order.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-records">
                  No sales records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;