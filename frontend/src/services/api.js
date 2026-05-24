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

export const createProduct = async (productData, token) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create product');
  }
  return data;
};

export const updateProduct = async (id, productData, token) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update product');
  }
  return data;
};

export const deleteProduct = async (id, token) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete product');
  }
  return data;
};

export const getSellerProducts = async (token) => {
  const response = await fetch(`${API_URL}/products/seller/myproducts`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const getSellerStats = async (token) => {
  const response = await fetch(`${API_URL}/products/seller/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
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

export const getSellerOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders/seller/myorders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const updateOrderStatus = async (orderId, status, token) => {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update order status');
  }
  return data;
};

// Upload API
export const uploadImage = async (imageData, token) => {
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ image: imageData })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload image');
  }
  return data;
};

export const deleteImage = async (publicId, token) => {
  const response = await fetch(`${API_URL}/upload/${publicId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete image');
  }
  return data;
};
