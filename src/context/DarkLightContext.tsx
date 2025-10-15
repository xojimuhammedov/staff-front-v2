import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext({});

const DarkLightProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState(() => {
    const initialTheme = localStorage.getItem('theme');
    return initialTheme ? initialTheme : 'light';
  });

  function toggleTheme() {
    setDarkMode((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme);
    }
  }, [darkMode]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode === 'dark' ? '#18181A' : 'white';
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkLightProvider');
  }
  return context;
};

export { DarkLightProvider, useDarkMode };
