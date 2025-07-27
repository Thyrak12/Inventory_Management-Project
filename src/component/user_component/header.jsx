import React from 'react';

const UserHeader = ({ onAddUserClick }) => {
  return (
    <div className="user-header">
      <div className="user-header-title">
        <h1>User Management</h1>
        <p>Manage system users and their permissions</p>
      </div>
      <button 
        className="user-add-btn" 
        onClick={onAddUserClick}
      >
        <span>+</span>
        Add User
      </button>
    </div>
  );
};

export default UserHeader; 