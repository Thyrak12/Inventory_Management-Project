import React, { useState } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaBoxOpen,
  FaFilter,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import './style/product.css';

const ProductsPage = () => {
  // Sample product data
  const [products, setProducts] = useState([
    { id: 1, name: 'Wireless Headphones', sku: 'WH-1000XM4', category: 'Electronics', price: 299.99, stock: 45, status: 'In Stock' },
    { id: 2, name: 'Bluetooth Speaker', sku: 'BS-SP200', category: 'Electronics', price: 129.99, stock: 12, status: 'Low Stock' },
    { id: 3, name: 'Smartphone X', sku: 'SP-X-256', category: 'Electronics', price: 899.99, stock: 8, status: 'Low Stock' },
    { id: 4, name: 'Laptop Pro', sku: 'LP-15-i7', category: 'Computers', price: 1499.99, stock: 15, status: 'In Stock' },
    { id: 5, name: 'Desk Chair', sku: 'DC-ERG01', category: 'Furniture', price: 249.99, stock: 0, status: 'Out of Stock' },
  ]);

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: ''
  });

  // Filter products
  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      filters.category ? product.category === filters.category : true
    ) && (
      filters.status ? product.status === filters.status : true
    );
  });

  // Delete product
  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaBoxOpen className="header-icon" />
          Product Inventory
        </h1>
        <button className="add-product-btn">
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="controls-bar">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
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
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Computers">Computers</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <button 
            className="clear-filters"
            onClick={() => setFilters({ category: '', status: '' })}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.status.replace(/\s+/g, '-').toLowerCase()}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit-btn">
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Pagination would go here */}
    </div>
  );
};

export default ProductsPage;