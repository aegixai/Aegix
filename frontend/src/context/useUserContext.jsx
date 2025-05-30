import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: localStorage.getItem("username"),
    role: localStorage.getItem("userRole"),
  });

  useEffect(() => {
    setUser({
      username: localStorage.getItem("username"),
      role: localStorage.getItem("userRole"),
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);