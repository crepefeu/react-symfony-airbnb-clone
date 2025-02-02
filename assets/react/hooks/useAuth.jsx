import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async (authToken = token) => {
    if (!authToken) return;

    try {
      const response = await fetch("/api/me", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      console.log(storedUser);
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchUser(storedToken); // Fetch fresh user data with stored token
    }
  }, []);

  const authentication = async () => {
    const response = await fetch("/api/is-authenticated", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const login = (response) => {
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("token", response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    location.href = "/";
  };

  return {
    user,
    setUser,
    isAuthenticated,
    token,
    login,
    logout,
    authentication,
    fetchUser,
    setToken,
  };
};

export default useAuth;
