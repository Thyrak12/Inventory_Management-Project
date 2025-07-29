import API from '../../api.js';

// Get all users with pagination and search
export const fetchUsers = async (page = 1, limit = 10, search = '', role = '') => {
  const token = localStorage.getItem('token');
  let url = `/auth/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  
  if (role) {
    url += `&role=${encodeURIComponent(role)}`;
  }
  
  const response = await API.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create a new user
export const createUser = async (userData) => {
  const token = localStorage.getItem('token');
  const response = await API.post('/auth/register', userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update an existing user
export const updateUser = async (userId, userData) => {
  const token = localStorage.getItem('token');
  const response = await API.put(`/auth/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a user
export const deleteUser = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await API.delete(`/auth/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}; 