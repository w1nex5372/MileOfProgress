// HabitContext.js
import React, { createContext, useContext, useState } from "react";

const HabitContext = createContext();

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState([]);
  // Function to clear the habits data and reset to initial value
  const clearHabits = () => {
    setHabits([]);
  };

  return (
    <HabitContext.Provider value={{ habits, setHabits, clearHabits }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabitContext() {
  return useContext(HabitContext);
}
