import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchUsers, createUser, updateUser, deleteUser } from '../component/api/user_api.js';
import UserHeader from '../component/user_component/header';
import UserFilter from '../component/user_component/filter';
import UserTable from '../component/user_component/table';
import AddUserModal from '../component/user_component/add_modal';
import EditUserModal from '../component/user_component/edit_modal';
import '../style/user_manage.css';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [searchParams, setSearchParams] = useSearchParams({
    page: '1',
    limit: '10',
    search: '',
    role: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load users on component mount and when search params change
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const search = searchParams.get("search") || '';
        const role = searchParams.get("role") || '';

        console.log('Fetching users with params:', { page, limit, search, role });
        const response = await fetchUsers(page, limit, search, role);
        setUsers(response.data || []);
        
        // Ensure meta has proper default values
        const metaData = response.meta || {};
        console.log('Response meta data:', metaData);
        
        const processedMeta = {
          page: parseInt(metaData.page) || 1,
          totalPages: parseInt(metaData.totalPages) || 1,
          totalItems: parseInt(metaData.totalItems) || 0,
          limit: parseInt(metaData.limit) || limit
        };
        
        console.log('Processed meta data:', processedMeta);
        setMeta(processedMeta);
        
        setFilteredUsers(response.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        console.error("Error details:", err.response?.data);
        setError(`Failed to load users: ${err.response?.data?.error || err.message}`);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [searchParams]);



  const handleResetFilters = () => {
    setSearchParams({
      page: '1',
      limit: '10',
      search: '',
      role: ''
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
    window.scrollTo(0, 0);
  };

  const handleCreateUser = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      await createUser(userData);
      setShowAddModal(false);
      
      // Refresh the user list
      setSearchParams(prev => {
        prev.set('refresh', Date.now());
        return prev;
      });
      
      alert('User created successfully!');
    } catch (err) {
      console.error('Failed to create user:', err);
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (updateData) => {
    if (!editingUser) return;

    setIsLoading(true);
    setError(null);

    try {
      await updateUser(editingUser.id, updateData);
      setEditingUser(null);
      
      // Refresh the user list
      setSearchParams(prev => {
        prev.set('refresh', Date.now());
        return prev;
      });
      
      alert('User updated successfully!');
    } catch (err) {
      console.error('Failed to update user:', err);
      setError(err.response?.data?.error || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deleteUser(userId);
      
      // Refresh the user list
      setSearchParams(prev => {
        prev.set('refresh', Date.now());
        return prev;
      });
      
      alert('User deleted successfully!');
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="user-loading">
        <div className="user-loading-spinner"></div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="user-error-message">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="user-error-retry"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="user-management-system">
      <UserHeader onAddUserClick={() => setShowAddModal(true)} />

      <UserFilter
        searchTerm={searchParams.get("search") || ""}
        roleFilter={searchParams.get("role") || ""}
        onSearchChange={(e) => {
          const searchValue = e.target.value;
          setSearchParams(prev => {
            prev.set('search', searchValue);
            prev.set('page', '1');
            return prev;
          });
        }}
        onRoleFilterChange={(e) => {
          const roleValue = e.target.value;
          setSearchParams(prev => {
            prev.set('role', roleValue);
            prev.set('page', '1');
            return prev;
          });
        }}
        onReset={handleResetFilters}
      />

      {error && (
        <div className="user-error-message">
          {error}
        </div>
      )}

      {filteredUsers.length > 0 ? (
        <>
          <UserTable
            users={filteredUsers}
            onEdit={setEditingUser}
            onDelete={handleDeleteUser}
          />

          <div className="user-pagination">
            <div className="user-pagination-info">
              Showing {Math.max(1, (meta.page - 1) * meta.limit + 1)} to {Math.min(meta.page * meta.limit, meta.totalItems)} of {meta.totalItems} users
            </div>

            <div className="user-pagination-controls">
              <button
                disabled={meta.page <= 1 || isLoading}
                onClick={() => handlePageChange(meta.page - 1)}
                className="user-pagination-button"
              >
                Previous
              </button>

              <button
                disabled={meta.page >= meta.totalPages || isLoading}
                onClick={() => handlePageChange(meta.page + 1)}
                className="user-pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="user-empty-state">
          No users found matching your filters
        </div>
      )}

      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateUser}
        isLoading={isLoading}
      />

      <EditUserModal
        show={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSubmit={handleUpdateUser}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserManage;
