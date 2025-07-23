import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // crucial: sends cookie (refreshToken)
});

// 🛡 Attach access token from localStorage to each request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Auto-refresh token on 401 error
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { withCredentials: true }
        );

        const newToken = res.data.token;
        localStorage.setItem('token', newToken);

        // Update the failed request's header and retry it
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);

      } catch (refreshError) {
        console.error("🔴 Token refresh failed:", refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
