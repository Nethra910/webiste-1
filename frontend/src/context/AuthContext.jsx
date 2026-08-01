/* eslint-disable react/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  setAccessToken as saveAccessToken,
  clearAccessToken,
} from "../utils/tokenService.js";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = (token, userData) => {
    setAccessToken(token);
    saveAccessToken(token);
    setUser(userData);
  };

  // Refresh Access Token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/auth/refresh",
        {},
        {
          withCredentials: true,
        },
      );

      setAccessToken(response.data.accessToken);
      saveAccessToken(response.data.accessToken);
      setUser(response.data.user);

      return response.data.accessToken;
    } catch (error) {
      console.error("Refresh failed:", error.response?.data || error.message);

      setAccessToken(null);
      clearAccessToken();
      setUser(null);

      return null;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );

      toast.success("Logout successful");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setAccessToken(null);
      clearAccessToken();
      setUser(null);
    }
  };

  // Check authentication when app starts
  useEffect(() => {
    const checkAuth = async () => {
      await refreshAccessToken();
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        login,
        logout,
        refreshAccessToken,
        setAccessToken: (token) => {
          setAccessToken(token);
          saveAccessToken(token);
        },
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
