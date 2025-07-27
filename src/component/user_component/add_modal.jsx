import React, { useState } from 'react';

const AddUserModal = ({ show, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
    setErrors({});
    onClose();
  };

  if (!show) return null;

  return (
    <div className="user-modal-overlay">
      <div className="user-modal">
        <div className="user-modal-header">
          <h2 className="user-modal-title">Add New User</h2>
          <button className="user-modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="user-modal-body">
          <div className="user-form-group">
            <label className="user-form-label">
              Name <span className="user-required">*</span>
            </label>
            <input
              type="text"
              name="name"
              className={`user-form-input ${errors.name ? 'user-form-input-error' : ''}`}
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
            />
            {errors.name && <span className="user-error-message">{errors.name}</span>}
          </div>

          <div className="user-form-group">
            <label className="user-form-label">
              Email <span className="user-required">*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`user-form-input ${errors.email ? 'user-form-input-error' : ''}`}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
            {errors.email && <span className="user-error-message">{errors.email}</span>}
          </div>

          <div className="user-form-group">
            <label className="user-form-label">
              Password <span className="user-required">*</span>
            </label>
            <input
              type="password"
              name="password"
              className={`user-form-input ${errors.password ? 'user-form-input-error' : ''}`}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
            />
            {errors.password && <span className="user-error-message">{errors.password}</span>}
          </div>

          <div className="user-form-group">
            <label className="user-form-label">Role</label>
            <select
              name="role"
              className="user-form-input"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </form>

        <div className="user-modal-footer">
          <button
            type="button"
            className="user-modal-cancel"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="user-modal-save"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal; 