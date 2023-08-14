import React from "react";
import useHabitTracker from "./useHabitTracker";

const HabitStatistics = ({ associatedHabits, habitIdToNameMap }) => {
  const habitsData = useHabitTracker(associatedHabits);

  // Calculate the total habit score for all habits
  let totalHabitScore = 0;
  let totalMonths = 0;
  Object.keys(habitsData).forEach((habitId) => {
    const habitData = habitsData[habitId];
    Object.values(habitData.habitScores).forEach((score) => {
      if (!isNaN(score)) {
        totalHabitScore += score;
        totalMonths++;
      }
    });
  });

  return (
    <div className="bg-white p-4 rounded-md shadow border border-gray-300">
      <h3 className="text-xl font-semibold mb-4">Habits Statistics</h3>

      {/* Total Habit Score Line */}
      <div className="h-2 bg-gray-200 rounded-lg mt-2 relative">
        <div
          className="absolute top-0 left-0 h-2 bg-green-500 rounded-lg"
          style={{
            width: totalMonths > 0 ? `${totalHabitScore / totalMonths}%` : "0%",
          }}
        ></div>
      </div>
      <p className="text-sm mt-2">
        Total Habit Score Progress:{" "}
        {totalMonths > 0 ? (totalHabitScore / totalMonths).toFixed(2) : "0"}%
      </p>

      <div className="h-48 overflow-y-scroll">
        {Object.keys(habitsData).map((habitId) => {
          const habitData = habitsData[habitId];
          const { habitScores, streak } = habitData;
          const habitName = habitIdToNameMap[habitId] || "Unknown Habit";
          let totalScore = 0;

          // Calculate the total habit score for this habit
          Object.values(habitScores).forEach((score) => {
            totalScore += score;
          });

          // Calculate the average habit score for this habit
          const averageScore =
            Object.keys(habitScores).length > 0
              ? totalScore / Object.keys(habitScores).length
              : 0;

          return (
            <div
              key={habitId}
              className="mb-4 border shadow-lg border-gray-300 p-4 rounded-lg"
            >
              <h2 className="text-xl font-bold mb-2 text-blue-600">
                Habit name: {habitName}
              </h2>
              <p className="text-sm">
                <span className="font-bold">Longest Streak:</span>{" "}
                {streak.longestStreak}
              </p>

              <h3 className="text-md font-bold mt-4 mb-2">Habit Scores:</h3>
              <ul className="text-sm">
                {Object.keys(habitScores).map((month) => (
                  <li key={month} className="mb-1">
                    {month}: {habitScores[month]}
                  </li>
                ))}
              </ul>

              {/* Visual representation of habit score as a line of percentages */}
              <div className="relative h-2 bg-gray-200 rounded-lg mt-2">
                <div
                  className="absolute top-0 left-0 h-2 bg-green-500 rounded-lg"
                  style={{
                    width: `${averageScore}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm mt-2">
                Habit Score Progress: {averageScore.toFixed(2)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitStatistics;
