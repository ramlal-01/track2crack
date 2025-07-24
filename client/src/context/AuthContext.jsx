import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser || null);

  // 👇 Call this after login
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", userData._id);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  };

  // 👇 If user exists but token is missing (e.g., manual refresh), logout
  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token && storedUser) {
      try {
        // Try refresh
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          method: "GET",
          credentials: "include", // send cookie
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("token", data.token);
          // don't logout, just continue
        } else {
          logout(); // only logout if refresh fails
        }
      } catch (err) {
        logout();
      }
    }
  };

  checkAuth();
}, []);


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
