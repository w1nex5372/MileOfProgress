// badgeContext.js
import React, { createContext, useState, useContext } from "react";

const BadgeContext = createContext();

export const useBadgeContext = () => useContext(BadgeContext);

export const BadgeProvider = ({ children }) => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [unlockedBadges, setUnlockedBadges] = useState([]); // Add unlockedBadges state

  return (
    <BadgeContext.Provider
      value={{
        earnedBadges,
        setEarnedBadges,
        unlockedBadges, // Include unlockedBadges in the context value
        setUnlockedBadges, // Include setUnlockedBadges in the context value
      }}
    >
      {children}
    </BadgeContext.Provider>
  );
};
