import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor untuk menyisipkan Bearer token Sanctum secara otomatis
apiClient.interceptors.request.use((config) => {
  try {
    const authData = localStorage.getItem('wayangverse_auth_user');
    if (authData) {
      const parsed = JSON.parse(authData);
      const token = parsed?.token || localStorage.getItem('wayangverse_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (_e) {
    // Abaikan jika JSON corrupt
  }
  return config;
});

/**
 * Health check handshake to Laravel backend
 * @returns {Promise<Object>} API Status response
 */
export const checkApiStatus = async () => {
  try {
    const response = await apiClient.get('/status');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Gagal terhubung ke Backend Laravel',
    };
  }
};

export default apiClient;
