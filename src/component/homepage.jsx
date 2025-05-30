import React from 'react';
import './style/homepage.css'; // Assuming you have a CSS file for styling

import { 
  FaBoxes, 
  FaClipboardList, 
  FaTruck, 
  FaChartLine,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const Dashboard = () => {
  // Sample data - replace with your actual data
  const metrics = [
    { title: "Total Products", value: 1.248, icon: <FaBoxes />, trend: "up", change: "12%" },
    { title: "Pending Orders", value: 56, icon: <FaClipboardList />, trend: "down", change: "5%" },
    { title: "Active Suppliers", value: 28, icon: <FaTruck />, trend: "up", change: "3%" },
    { title: "Low Stock Items", value: 19, icon: <FaExclamationTriangle />, trend: "up", change: "8%" }
  ];

  const recentActivities = [
    { id: 1, action: "Product added", item: "Wireless Headphones", time: "10 mins ago" },
    { id: 2, action: "Order processed", item: "#ORD-10025", time: "25 mins ago" },
    { id: 3, action: "Inventory updated", item: "Smartphone X", time: "1 hour ago" },
    { id: 4, action: "New supplier added", item: "TechGadgets Inc.", time: "2 hours ago" }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Inventory Overview</h2>
        <div className="date-filter">
          <span>Last 30 Days</span>
          <select>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last Quarter</option>
          </select>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div className="metric-card" key={index}>
            <div className="metric-icon" style={{ backgroundColor: getIconBgColor(index) }}>
              {metric.icon}
            </div>
            <div className="metric-info">
              <span className="metric-title">{metric.title}</span>
              <span className="metric-value">{metric.value.toLocaleString()}</span>
            </div>
            <div className={`metric-trend ${metric.trend}`}>
              {metric.trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
              <span>{metric.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables Section */}
      <div className="dashboard-content">
        {/* Inventory Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Inventory Levels</h3>
            <div className="chart-legend">
              <span className="legend-item"><div className="legend-color in-stock"></div> In Stock</span>
              <span className="legend-item"><div className="legend-color low-stock"></div> Low Stock</span>
            </div>
          </div>
          <div className="chart-placeholder">
            {/* Replace with your actual chart component */}
            <FaChartLine className="chart-icon" />
            <p>Inventory chart will appear here</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-container">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            {recentActivities.map(activity => (
              <li key={activity.id}>
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-item">{activity.item}</span>
                </div>
                <span className="activity-time">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn">
          <FaBoxes /> Add New Product
        </button>
        <button className="action-btn">
          <FaClipboardList /> Create Order
        </button>
        <button className="action-btn">
          <FaTruck /> Add Supplier
        </button>
      </div>
    </div>
  );
};

// Helper function for icon colors
const getIconBgColor = (index) => {
  const colors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12"];
  return colors[index % colors.length];
};

export default Dashboard;