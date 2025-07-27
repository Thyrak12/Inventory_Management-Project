import React from 'react';

const OrdersTable = ({ orders }) => {
  // Helper function to format price
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '$0.00';
    const num = typeof price === 'string' ? parseFloat(price) : Number(price);
    return `$${num.toFixed(2)}`;
  };

  return (
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
            {orders.map(order => (
              <tr key={order.orderID}>
                <td>#{order.orderID}</td>
                <td>{order.date}</td>
                <td>{order.product}</td>
                <td>{order.color}</td>
                <td>{order.size}</td>
                <td>{order.qty}</td>
                <td>{formatPrice(order.price)}</td>
                <td>{formatPrice(order.total)}</td>
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
  );
};

export default OrdersTable;