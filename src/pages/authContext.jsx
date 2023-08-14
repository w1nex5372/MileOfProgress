import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const expirationTime = new Date().getTime() + 3 * 60 * 60 * 1000; // Set expiration time to 3 hours from now (3 hours * 60 minutes * 60 seconds * 1000 milliseconds)

    Cookies.set("isLoggedIn", true, { expires: new Date(expirationTime) });

    const newExpirationTime = expirationTime - 2.5 * 60 * 60 * 1000; // Set expiration time to 2.5 hours before the existing expirationTime
    Cookies.set("expires", newExpirationTime, {
      expires: new Date(newExpirationTime),
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    Cookies.remove("isLoggedIn");
    Cookies.remove("expires");
  };

  useEffect(() => {
    const storedAuthStatus = Cookies.get("isLoggedIn");

    if (storedAuthStatus) {
      const expirationTime = Number(Cookies.get("expires"));
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        console.log("test for currentTime > expirationTime");
        handleLogout(); // Token has expired, log off the user
      } else {
        setIsLoggedIn(true);
      }
    }

    // Set up a timer to periodically check for expiration
    const expirationCheckInterval = setInterval(() => {
      const expirationTime = Number(Cookies.get("expires"));
      const currentTime = new Date().getTime();

      console.log("expt time:", expirationTime, "current time", currentTime);

      if (currentTime > expirationTime) {
        console.log("test for currentTime > expirationTime on interval");
        handleLogout(); // Token has expired, log off the user
      }
    }, 1 * 60 * 60 * 1000); // Adjust the interval duration as needed (e.g., check every 60min)

    // Clean up the interval when the component unmounts
    return () => clearInterval(expirationCheckInterval);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
