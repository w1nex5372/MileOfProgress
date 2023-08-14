import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHabitContext } from "../habitContext";
import HabitStatistics from "../goalHabitAssociate/HabitsStatistics";

const GoalHabitAssociate = ({
  associatedHabits,
  onClose,
  setAssociatedHabits,
  selectedGoalId,
}) => {
  const [habitsData, setHabitsData] = useState([]);
  const [activeHabit, setActiveHabit] = useState(null);
  const { habits } = useHabitContext();
  const [showHabits, setShowHabits] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null); // Added selectedHabit state
  const [showStatistics, setShowStatistics] = useState(false);

  const habitArray = Object.values(habits);

  const habitIdToNameMap = {};
  habitArray.forEach((habit) => {
    habitIdToNameMap[habit.id] = habit.name;
  });

  const handleAddHabit = () => {
    setShowHabits(!showHabits);
  };

  const handleShowStatistics = () => {
    setShowStatistics(!showStatistics);
  };

  useEffect(() => {
    // Fetch habit data for each associated habit
    const fetchHabitData = async () => {
      try {
        // Make a comma-separated string of associated habit IDs
        const habitIdsString = associatedHabits.join(",");

        // Fetch habit data from the backend API based on habit IDs
        const response = await axios.get(
          `http://localhost:3200/api/getHabitsData?habitIds=${habitIdsString}`
        );

        // Check if the response contains data
        if (response.data.length > 0) {
          // Set the fetched habit data in the state
          setHabitsData(response.data);
          setActiveHabit(response.data[0]); // Set the first habit as active by default
        } else {
          console.log("No habit data found.");
        }
      } catch (error) {
        console.error("Error while fetching habit data:", error);
      }
    };

    fetchHabitData();
  }, [associatedHabits]);

  const handleRemoveHabit = async (habitId) => {
    // Find the index of the habit with the given id in the habitsData array
    const indexToRemove = habitsData.findIndex((habit) => habit.id === habitId);

    // If the habit with the specified id is not found, just return early
    if (indexToRemove === -1) {
      console.log("Habit not found in habitsData.");
      return;
    }

    try {
      console.log(activeHabit, "activeHabit");
      // Make an API call to delete the habit association from the backend
      const response = await axios.delete(
        `http://localhost:3200/api/goal/habit/${selectedGoalId}/${habitId}`
      );

      // Check if the API call was successful and log the response data
      console.log("Response data:", response.data);

      // Check if the API call was successful
      if (response.data.success) {
        // Create a new array without the habit to be removed
        const updatedHabitsData = [
          ...habitsData.slice(0, indexToRemove),
          ...habitsData.slice(indexToRemove + 1),
        ];

        // Update the state with the new array
        setHabitsData(updatedHabitsData);

        // Update the associatedHabits state by removing the habitId
        const updatedAssociatedHabits = associatedHabits.filter(
          (habit) => habit.toString() !== habitId.toString()
        );

        setAssociatedHabits(updatedAssociatedHabits);
        // Convert the updatedAssociatedHabits to a JSON string

        // Update the habit_ids column in the goal_habit_association table

        setActiveHabit(null); // Reset the activeHabit selection after removing the habit
      } else {
        console.log("Error removing habit association:", response.data.error);
        // Handle the error if needed
      }
    } catch (error) {
      console.error("Error removing habit association:", error);
      // Handle the error if needed
    }
  };

  const handleHabitClick = (habit) => {
    setActiveHabit(habit);
    console.log(activeHabit);
  };

  const filteredHabits = habitArray.filter(
    (habit) => !habitsData.some((data) => data.id === habit.id)
  );

  const handleHabitSelect = async (habitId) => {
    const habitIdAsString = String(habitId);

    const selectedHabitObj = filteredHabits.find(
      (habit) => habit.id === parseInt(habitId, 10)
    );

    setSelectedHabit(selectedHabitObj);

    // Check if the habit is not already in the habitsData array
    if (selectedHabitObj) {
      // Add the selectedHabitObj to the habitsData state
      setHabitsData([...habitsData, selectedHabitObj]);

      // Update the associatedHabits state by adding the habitId to it
      setAssociatedHabits([...associatedHabits, habitIdAsString]);

      try {
        // Make an API call to update the habit_ids column in the database
        const response = await axios.put(
          `http://localhost:3200/api/updateGoalHabitAssociation/${selectedGoalId}`,
          {
            habitIds: [...associatedHabits, habitIdAsString],
          }
        );

        // Check if the API call was successful and log the response data
        console.log("Response data:", response.data);
      } catch (error) {
        console.error("Error updating habit association:", error);
        // Handle the error if needed
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        {habitsData.length > 0 ? (
          <div>
            <div className="flex flex-wrap -mx-2 mb-4">
              {habitsData.map((habit) => (
                <div
                  key={habit.id}
                  className={`cursor-pointer p-2 mb-2 mx-2 ${
                    habit === activeHabit
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleHabitClick(habit)}
                >
                  {habit.name}
                </div>
              ))}
            </div>
            {activeHabit && (
              <div className="mt-4 border red text-center">
                <h3 className="text-lg font-bold">{activeHabit.name}</h3>
                <p className="text-gray-600 mb-2">{activeHabit.description}</p>
                <p className="text-gray-600 mb-2">{activeHabit.reminder}</p>
                <div className="space-x-2">
                  {/* Add more buttons or features as needed */}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No habit data available.</p>
        )}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={handleAddHabit}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded"
          >
            Add Habit
          </button>

          <button
            onClick={() => activeHabit && handleRemoveHabit(activeHabit.id)}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded"
          >
            Remove
          </button>

          <button
            onClick={() => handleShowStatistics()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded"
          >
            Statistics
          </button>
        </div>

        {showHabits && (
          <div className="mt-4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
            <select
              className="block w-full max-w-full px-3 py-2 border border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md"
              onChange={(e) => handleHabitSelect(e.target.value)}
            >
              <option value="">Select a habit</option>
              {filteredHabits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {showStatistics && (
          <HabitStatistics
            associatedHabits={associatedHabits}
            habitIdToNameMap={habitIdToNameMap}
          />
        )}
      </div>
    </div>
  );
};

export default GoalHabitAssociate;
