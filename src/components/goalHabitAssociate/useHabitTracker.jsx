import { useEffect, useState } from "react";
import axios from "axios";

const useHabitTracker = (selectedHabits) => {
  const [habitsData, setHabitsData] = useState({});

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const calculateStreak = (calendarDays) => {
    // Initialize the streak variables
    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreakStartDate = null;
    let longestStreakStartDate = null;

    calendarDays.forEach((day, index) => {
      if (day.background_color === "bg-green-500") {
        if (
          index > 0 &&
          calendarDays[index - 1].background_color === "bg-green-500"
        ) {
          currentStreak++;
        } else {
          currentStreak = 1;
          currentStreakStartDate = new Date(day.date);
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          longestStreakStartDate = currentStreakStartDate;
        }
      }
    });

    return {
      longestStreak,
      longestStreakStartDate,
    };
  };

  useEffect(() => {
    const fetchHabitData = async () => {
      const getMonth = (date) => {
        return date.toLocaleString("default", { month: "long" });
      };
      const weightedCompletion = 0.6; // Weight for completion count
      const weightedIncompletion = 0.3; // Weight for incompletion count
      const weightedStreak = 0.1; // Weight for streak count

      const calculateHabitScore = (
        completionCountByMonth,
        incompletionCountByMonth,
        streakCountByMonth
      ) => {
        const habitScoresByMonth = {};

        months.forEach((month) => {
          const completionCount = completionCountByMonth[month] || 0;
          const incompletionCount = incompletionCountByMonth[month] || 0;
          const streakCount = streakCountByMonth[month] || 0;

          // Calculate the habit score using the weighted values
          const habitScore =
            weightedCompletion * completionCount +
            weightedIncompletion * incompletionCount +
            weightedStreak * streakCount;

          if (habitScore !== 0) {
            habitScoresByMonth[month] = habitScore;
          }
        });

        return habitScoresByMonth;
      };

      if (selectedHabits && selectedHabits.length > 0) {
        try {
          const response = await axios.get(
            `http://localhost:3200/api/getHabitData`,
            {
              params: {
                habitIds: selectedHabits,
              },
            }
          );
          const habitDataArray = response.data.habitData;

          const habitDataPromises = habitDataArray.map(async (habitData) => {
            const fetchedCalendarDays = habitData.calendarDays;

            // Calculate the completion count for each month based on the background color
            const completionCountByMonth = {}; // Track completion count for each month
            const incompletionCountByMonth = {}; // Track incompletion count for each month
            const streakCountByMonth = {}; // Track streak count for each month

            const { longestStreak, longestStreakStartDate } =
              calculateStreak(fetchedCalendarDays);

            fetchedCalendarDays.forEach((day) => {
              if (day.background_color === "bg-green-500") {
                const date = new Date(day.date);
                const month = getMonth(date);

                completionCountByMonth[month] =
                  (completionCountByMonth[month] || 0) + 1;

                const prevStreakCount = streakCountByMonth[month] || 0;
                streakCountByMonth[month] = prevStreakCount + 1;
              } else if (day.background_color === "bg-red-500") {
                const date = new Date(day.date);
                const month = getMonth(date);

                incompletionCountByMonth[month] =
                  (incompletionCountByMonth[month] || 0) + 1;

                streakCountByMonth[month] = 0;
              }
            });

            // Calculate the total number of completion and incompletion days
            const totalCompletionDays = Object.values(
              completionCountByMonth
            ).reduce((total, count) => total + count, 0);

            const totalIncompletionDays = Object.values(
              incompletionCountByMonth
            ).reduce((total, count) => total + count, 0);

            const habitScoresByMonth = calculateHabitScore(
              completionCountByMonth,
              incompletionCountByMonth,
              streakCountByMonth
            );

            return {
              habitId: habitData.habitId,
              streak: { longestStreak, longestStreakStartDate },
              habitScores: habitScoresByMonth,
              totalCompletionDays,
              totalIncompletionDays,
            };
          });

          const processedHabitDataArray = await Promise.all(habitDataPromises);

          // Convert the array of habit data into an object with habitId as the key
          const habitDataObject = processedHabitDataArray.reduce(
            (acc, curr) => {
              acc[curr.habitId] = {
                streak: curr.streak,
                habitScores: curr.habitScores,
                totalCompletionDays: curr.totalCompletionDays,
                totalIncompletionDays: curr.totalIncompletionDays,
              };
              return acc;
            },
            {}
          );

          setHabitsData(habitDataObject);
        } catch (error) {
          console.error("Error fetching habit data:", error);
        }
      }
    };

    fetchHabitData();
  }, [selectedHabits]);

  return habitsData;
};

export default useHabitTracker;
