import storage from './storage';
import config from './../configs/index';
import axios, { AxiosError } from 'axios';

const request = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: config.API_ROOT,
  params: {}
});

request.interceptors.request.use(
  (config) => {
    const token = storage.get('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject(error);
  }
);


request.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        const refreshTokenExpire = storage.get('refreshToken');
        const response = await axios.post(`${config.API_ROOT}api/v1/auth/refresh`, {
          refreshToken: refreshTokenExpire
        });

        const { accessToken, refreshToken } = response?.data;
        storage.set('accessToken', accessToken);
        storage.set('refreshToken', refreshToken);

        // Retry original request
        return axios(error.config);
      } catch (refreshError) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { request };

