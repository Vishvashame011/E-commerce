export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';
export const UPLOAD_BASE_URL = process.env.REACT_APP_UPLOAD_URL || 'http://localhost:8081';
export const PRODUCTS_PER_PAGE = parseInt(process.env.REACT_APP_PRODUCTS_PER_PAGE) || 20;

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
  PRODUCTS_BY_CATEGORY: (category) => `${API_BASE_URL}/products/category/${category}`,
  PRODUCT_CATEGORIES: `${API_BASE_URL}/products/categories`,
  RELATED_PRODUCTS: (id, limit = 4) => `${API_BASE_URL}/products/${id}/related?limit=${limit}`,
  VALIDATE_PROMO: (code) => `${API_BASE_URL}/promo-codes/validate/${code}`,
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    PROFILE_IMAGE: `${API_BASE_URL}/users/profile/image`
  }
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

export default API_BASE_URL;