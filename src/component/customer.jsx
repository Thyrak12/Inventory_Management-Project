import React, { useState } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUserAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaTimes
} from 'react-icons/fa';
import '../style/customer.css';

const CustomersPage = () => {
  // Sample customer data
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Smith', phone: '(555) 123-4567', email: 'john.smith@example.com', address: '123 Main St, Anytown, USA', orders: 5, totalSpent: 1250.50 },
    { id: 2, name: 'Sarah Johnson', phone: '(555) 234-5678', email: 'sarah.j@example.com', address: '456 Oak Ave, Somewhere, USA', orders: 3, totalSpent: 789.99 },
    { id: 3, name: 'Michael Brown', phone: '(555) 345-6789', email: 'michael.b@example.com', address: '789 Pine Rd, Nowhere, USA', orders: 7, totalSpent: 2105.75 },
    { id: 4, name: 'Emily Davis', phone: '(555) 456-7890', email: 'emily.d@example.com', address: '321 Elm Blvd, Anywhere, USA', orders: 2, totalSpent: 450.25 },
    { id: 5, name: 'David Wilson', phone: '(555) 567-8901', email: 'david.w@example.com', address: '654 Cedar Ln, Everywhere, USA', orders: 10, totalSpent: 3560.80 },
  ]);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minOrders: '',
    minSpent: ''
  });

  // State for create customer modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    orders: 0,
    totalSpent: 0
  });

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      filters.minOrders ? customer.orders >= parseInt(filters.minOrders) : true
    ) && (
      filters.minSpent ? customer.totalSpent >= parseFloat(filters.minSpent) : true
    );
  });

  // Delete customer
  const deleteCustomer = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  // Handle create customer form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value
    });
  };

  // Handle create customer form submission
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    const customer = {
      id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
      ...newCustomer,
      orders: parseInt(newCustomer.orders),
      totalSpent: parseFloat(newCustomer.totalSpent)
    };
    setCustomers([...customers, customer]);
    setShowCreateModal(false);
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      orders: 0,
      totalSpent: 0
    });
  };

  return (
    <div className="customers-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaUserAlt className="header-icon" />
          Customer Information
        </h1>
        <button 
          className="add-customer-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Add Customer
        </button>
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Customer</h2>
              <button 
                className="close-modal"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="Format: 555-123-4567"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={newCustomer.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={newCustomer.address}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Orders</label>
                  <input
                    type="number"
                    name="orders"
                    value={newCustomer.orders}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Total Spent ($)</label>
                  <input
                    type="number"
                    name="totalSpent"
                    value={newCustomer.totalSpent}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="controls-bar">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filters {showFilters ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Minimum Orders</label>
            <input
              type="number"
              min="0"
              value={filters.minOrders}
              onChange={(e) => setFilters({...filters, minOrders: e.target.value})}
              placeholder="Any"
            />
          </div>

          <div className="filter-group">
            <label>Minimum Spent ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={filters.minSpent}
              onChange={(e) => setFilters({...filters, minSpent: e.target.value})}
              placeholder="Any"
            />
          </div>

          <button 
            className="clear-filters"
            onClick={() => setFilters({ minOrders: '', minSpent: '' })}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Customers Table */}
      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact Info</th>
              <th>Address</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-name">
                    <FaUserAlt className="customer-icon" />
                    {customer.name}
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div><FaPhone /> {customer.phone}</div>
                    <div><FaEnvelope /> {customer.email}</div>
                  </div>
                </td>
                <td>
                  <div className="address-info">
                    <FaMapMarkerAlt /> {customer.address}
                  </div>
                </td>
                <td>{customer.orders}</td>
                <td>${customer.totalSpent.toFixed(2)}</td>
                <td>
                  <button className="action-btn edit-btn">
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteCustomer(customer.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="no-results">
            <p>No customers found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;