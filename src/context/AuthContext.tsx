import { createContext, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { request } from 'services/request';
import authConfig from 'configs/auth';
import { toast } from 'react-toastify';
import storage from 'services/storage';
import { useNavigate } from 'react-router-dom';

interface User {
  // Define properties of user here
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  user: any | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (params: any, errorCallback?: (error: any) => void) => void;
  logout: () => void;
  checkAuth: (token?: string | null) => void;
}

const defaultProvider: AuthContextProps = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkAuth: () => Promise.resolve()
};

const AuthContext = createContext<AuthContextProps>(defaultProvider);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const navigate = useNavigate()

  useEffect(() => {
    const initAuth = async () => {
      checkAuth();
    };
    initAuth();
  }, []);

  const handleLogin = (params: any, errorCallback?: (error: any) => void) => {
    setLoading(false);
    request
      .post(authConfig.loginEndpoint, params)
      .then(async (response: AxiosResponse<any>) => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data?.accessToken);
        window.localStorage.setItem('refreshToken', response.data?.refreshToken);
        window.localStorage.setItem('userData', JSON.stringify(response?.data?.user));
        if (response?.data?.user?.role === "GUARD") {
          navigate("/employees")
        }
        else {
          navigate("/")
        }
        checkAuth(response.data?.jwt);
        toast.success('Siz muvaffaqiyatli kirdingiz!');
      })
      .catch((err: any) => {
        console.log(err);
        if (errorCallback) errorCallback(err);
      })
      .finally(() => {
        setLoading(true);
      });
  };

  const handleLogout = () => {
    const refreshToken = storage.get('refreshToken');

    if (refreshToken) {
      request
        .post(authConfig.logOutEndpoint, { refreshToken })
        .then(() => {
          // Clear tokens and user data on successful logout
          setUser(null);
          window.localStorage.removeItem(authConfig.storageTokenKeyName);
          window.localStorage.removeItem('refreshToken');
          window.location.replace('/login');
        })
        .catch((error) => {
          console.error('Logout error:', error);
          // Even if logout request fails, clear local data and redirect
          setUser(null);
          window.localStorage.removeItem(authConfig.storageTokenKeyName);
          window.localStorage.removeItem('refreshToken');
          window.location.replace('/login');
        });
    } else {
      // No refresh token found, just clear local data and redirect
      setUser(null);
      window.localStorage.removeItem(authConfig.storageTokenKeyName);
      window.localStorage.removeItem('refreshToken');
      window.location.replace('/login');
    }
  };


  const checkAuth = async (token: string | null = null) => {
    // console.log(token);
    // Your checkAuth implementation
  };

  const values: AuthContextProps = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    checkAuth: checkAuth
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
