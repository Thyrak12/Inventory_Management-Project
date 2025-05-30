import React from 'react';
import './style/header.css'; // Assuming you have a CSS file for styling
import { 
  FaTachometerAlt, 
  FaBoxes, 
  FaClipboardList, 
  FaTruck, 
  FaChartBar,
  FaUserCircle
} from 'react-icons/fa';

const InventorySidebar = () => {
  return (
    <aside className="inventory-sidebar">
      {/* Logo and Brand Name */}
      <div className="brand">
        <img src="/logo.png" alt="Inventory Logo" className="logo" />
        <h1>Inventory<span>Pro</span></h1>
      </div>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        <ul>
          <li>
            <a href="/dashboard" className="active">
              <FaTachometerAlt className="icon" />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/products">
              <FaBoxes className="icon" />
              <span>Products</span>
            </a>
          </li>
          <li>
            <a href="/orders">
              <FaClipboardList className="icon" />
              <span>Orders</span>
            </a>
          </li>
          <li>
            <a href="/customers">
              <FaChartBar className="icon" />
              <span>Customer</span>
            </a>
          </li>
          <li>
            <a href="/reports">
              <FaChartBar className="icon" />
              <span>Reports</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* User Profile */}
      <div className="user-profile">
        <FaUserCircle className="user-avatar" />
        <div className="user-info">
          <span className="username">Admin User</span>
          <span className="user-role">System Administrator</span>
        </div>
      </div>
    </aside>
  );
};

export default InventorySidebar;