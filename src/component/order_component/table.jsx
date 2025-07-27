import React from 'react';

const OrdersTable = ({ orders }) => {
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
  );
};

export default OrdersTable;