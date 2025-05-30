import React, { useState } from 'react';
import { FaSearch, FaFileExcel, FaFilePdf, FaPrint, FaFilter } from 'react-icons/fa';
import './style/report.css';

const ReportPage = () => {
  // Sample report data
  const [reportData, setReportData] = useState([
    { id: 1, date: '2023-06-01', category: 'Electronics', item: 'Laptop', quantity: 15, revenue: 12500 },
    { id: 2, date: '2023-06-02', category: 'Furniture', item: 'Office Chair', quantity: 8, revenue: 2400 },
    { id: 3, date: '2023-06-03', category: 'Electronics', item: 'Monitor', quantity: 12, revenue: 3600 },
    { id: 4, date: '2023-06-04', category: 'Stationery', item: 'Notebook', quantity: 45, revenue: 450 },
    { id: 5, date: '2023-06-05', category: 'Furniture', item: 'Desk', quantity: 5, revenue: 1750 },
  ]);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(reportData.map(item => item.category))];

  // Filter data based on search and filters
  const filteredData = reportData.filter(item => {
    const matchesSearch = 
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = (
      (!dateRange.start || item.date >= dateRange.start) &&
      (!dateRange.end || item.date <= dateRange.end)
    );
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesDate && matchesCategory;
  });

  // Calculate totals
  const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantity, 0);
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="report-page">
      <div className="report-header">
        <h1>Sales Report</h1>
        <div className="report-actions">
          <button className="export-btn">
            <FaFileExcel /> Export Excel
          </button>
          <button className="export-btn">
            <FaFilePdf /> Export PDF
          </button>
          <button className="export-btn">
            <FaPrint /> Print
          </button>
        </div>
      </div>

      <div className="report-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Date Range</label>
            <div className="date-range">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                placeholder="Start date"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                placeholder="End date"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="clear-filters"
            onClick={() => {
              setDateRange({ start: '', end: '' });
              setCategoryFilter('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Category</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>{item.category}</td>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td>${item.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4">Total</td>
              <td>{totalQuantity}</td>
              <td>${totalRevenue.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        {filteredData.length === 0 && (
          <div className="no-results">
            <p>No report data found matching your criteria</p>
          </div>
        )}
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <h3>Total Items</h3>
          <p>{reportData.length}</p>
        </div>
        <div className="summary-card">
          <h3>Filtered Items</h3>
          <p>{filteredData.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;