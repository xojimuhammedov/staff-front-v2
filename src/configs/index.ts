const config = {
  API_ROOT: import.meta.env.VITE_APP_NAME ?? 'http://192.168.100.82:3001/',
  FILE_URL: import.meta.env.VITE_APP_URL ?? 'http://192.168.100.82:3001/',
  DEFAULT_APP_LANG: 'ru',
  ROLES: [],
  PERMISSIONS: []
};

export default config;
