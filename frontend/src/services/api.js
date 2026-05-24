const API_URL = 'http://localhost:5000/api';

// Products API
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return response.json();
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return response.json();
};

// User API
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const getUserProfile = async (token) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const updateUserProfile = async (userData, token) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Cart API
export const getCart = async (token) => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const addToCart = async (productId, quantity, token) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });
  return response.json();
};

export const removeFromCart = async (productId, token) => {
  const response = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Orders API
export const createOrder = async (orderData, token) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return response.json();
};

export const getUserOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders/myorders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
