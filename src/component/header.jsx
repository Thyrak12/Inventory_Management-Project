import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../style/header.css';
import { 
  FaTachometerAlt, 
  FaBoxes, 
  FaClipboardList, 
  FaChartBar,
  FaUserCircle
} from 'react-icons/fa';

const InventorySidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="icon" /> },
    { path: '/products', label: 'Products', icon: <FaBoxes className="icon" /> },
    { path: '/orders', label: 'Orders', icon: <FaClipboardList className="icon" /> },
    { path: '/customers', label: 'Customer', icon: <FaChartBar className="icon" /> },
    { path: '/reports', label: 'Reports', icon: <FaChartBar className="icon" /> }
  ];

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
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
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