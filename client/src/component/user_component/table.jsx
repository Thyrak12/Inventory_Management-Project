import React from 'react';

const UserTable = ({ users, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead className="user-table-header">
          <tr>
            <th className="user-table-header-cell">Name</th>
            <th className="user-table-header-cell">Email</th>
            <th className="user-table-header-cell">Role</th>
            <th className="user-table-header-cell">Created</th>
            <th className="user-table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="user-table-row">
              <td className="user-table-cell">{user.name}</td>
              <td className="user-table-cell">{user.email}</td>
              <td className="user-table-cell">
                <span className={`user-role-badge user-role-${user.role}`}>
                  {user.role}
                </span>
              </td>
              <td className="user-table-cell">{formatDate(user.createdAt)}</td>
              <td className="user-table-cell">
                <button
                  className="user-action-button user-edit-button"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="user-action-button user-delete-button"
                  onClick={() => onDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable; 