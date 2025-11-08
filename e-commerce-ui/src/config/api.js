export const API_BASE_URL = 'http://localhost:8081/api';

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
  PRODUCTS_BY_CATEGORY: (category) => `${API_BASE_URL}/products/category/${category}`,
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

export default API_BASE_URL;