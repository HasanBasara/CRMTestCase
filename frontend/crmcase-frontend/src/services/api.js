import axios from 'axios';

const API_URL = 'https://localhost:7093/api';

axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  export const authService = {
    login: async (username, password) => {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    },
    logout: async () => {
      await axios.post(`${API_URL}/auth/logout`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    getCurrentUser: () => {
      return JSON.parse(localStorage.getItem('user'));
    }
  };

  export const customerService = {
    getAll: async () => {
      const response = await axios.get(`${API_URL}/customer`);
      return response.data;
    },
    getById: async (id) => {
      const response = await axios.get(`${API_URL}/customer/${id}`);
      return response.data;
    },
    search: async (params) => {
      const response = await axios.get(`${API_URL}/customer/search`, { params });
      return response.data;
    },
    create: async (customer) => {
      const response = await axios.post(`${API_URL}/customer`, customer);
      return response.data;
    },
    update: async (id, customer) => {
      const response = await axios.put(`${API_URL}/customer/${id}`, customer);
      return response.data;
    },
    delete: async (id) => {
      await axios.delete(`${API_URL}/customer/${id}`);
    }
  };