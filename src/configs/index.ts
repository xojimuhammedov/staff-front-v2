const config = {
  API_ROOT: import.meta.env.VITE_APP_NAME ?? 'http://139.28.47.17:3703/',
  FILE_URL: import.meta.env.VITE_APP_URL ?? 'http://139.28.47.17:3703',
  DEFAULT_APP_LANG: 'ru',
  ROLES: [],
  PERMISSIONS: []
};

export default config;
