const storage = {
  get: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return window?.localStorage && window?.localStorage.getItem(key);
    }
    return null;
  },
  set: (key: string, value: string): void => {
    if (!value || value.length <= 0) {
      return;
    }
    if (window?.localStorage) {
      window?.localStorage.setItem(key, value);
    }
  },
  remove: (key: string): void => {
    if (window?.localStorage && window?.localStorage[key]) {
      window?.localStorage.removeItem(key);
    }
  }
};

export default storage;
