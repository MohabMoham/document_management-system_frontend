import axios from 'axios';
import Cookies from 'js-cookie'; // use js-cookie to read CSRF token

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Include HTTP-only auth cookie
});

// Interceptor to attach CSRF token from cookie
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('XSRF-TOKEN'); // Get token set by backend
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
export default axiosInstance;