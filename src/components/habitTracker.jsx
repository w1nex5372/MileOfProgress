import React, { useState } from "react";
import HabitCalendar from "./celender";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faChartSimple,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect } from "react";
import ChartComponent from "./charts/mainChartComp";

import { useBadgeContext } from "./badgeContext";
import { useHabitContext } from "./habitContext";

const HabitTracker = () => {
  const { habits, setHabits } = useHabitContext();

  const [newHabit, setNewHabit] = useState("");
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [reminder, setReminder] = useState("");
  const [category, setCategory] = useState("");
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [parentChartData, setParentChartData] = useState({});
  const [parentChartOptions, setParentChartOptions] = useState({});
  const [chartDisplay, setChartDisplay] = useState("weeks");
  const [streak, setStreak] = useState(null);
  const [displayStreak, setDisplayStreak] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [habitScores, setHabitScores] = useState({});
  const [showStrength, setShowStrength] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(true);
  const [scorePage, setScorePage] = useState(0);
  const scoresPerPage = 4; // Number of months to show per page

  // Define the unlockedBadges state variable
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  // Use the useBadgeContext hook to access the earnedBadges array
  const { earnedBadges, setEarnedBadges } = useBadgeContext();

  const handleCloseBadge = () => {
    setUnlockedBadges(!unlockedBadges);
    setShowBadgeModal(false);
  };

  const areAnyHabitScoresGreaterThanZero = Object.values(habitScores).some(
    (habitScore) => parseFloat(habitScore) > 0
  );

  const handleDisplayStrenght = () => {
    setShowStrength(!showStrength);
  };

  const handleDisplayStreak = () => {
    setDisplayStreak(!displayStreak);
    setShowStreak(!showStreak);
  };

  const handleChartDisplayChange = (displayOption) => {
    setChartDisplay(displayOption);
  };

  const updateChartData = (data) => {
    setParentChartData(data);
  };

  const updateChartOptions = (options) => {
    setParentChartOptions(options);
  };

  const handleChartClick = () => {
    setShowChart(!showChart);
  };

  const handleCalenderClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleHabitSelect = (habit) => {
    if (selectedHabit === habit) {
      setSelectedHabit(null);
    } else {
      setSelectedHabit(habit);
    }
  };

  useEffect(() => {
    if (habits.length === 1) {
      setSelectedHabit(habits[0]);
    }
  }, [habits]);

  const handleAddHabit = async () => {
    if (newHabit) {
      const newHabitObject = {
        name: newHabit,
        frequency,
        reminder,
        category,
        isCompleted,
        description,
      };

      try {
        // Send the habit data to the server
        const response = await axios.post(
          "http://localhost:3200/api/habits",
          newHabitObject
        );
        if (response.data.success) {
          const createdHabit = response.data;
          const habitId = createdHabit.habitId; // Get the habit ID from the response
          const habitWithId = { ...newHabitObject, id: habitId };

          setHabits([...habits, habitWithId]);
          setNewHabit("");
          setFrequency("daily");
          setReminder("");
          setCategory("");
          setDescription("");
          setShowAddHabit(false);
        } else {
          console.error("Error adding habit:", response.data.error);
        }
      } catch (error) {
        console.error("Error adding habit:", error);
      }
    }
  };

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        // Send a GET request to fetch habits from the server
        const response = await axios.get("http://localhost:3200/api/getHabits");
        if (response.data.success) {
          const fetchedHabits = response.data.habits.map((habit) => ({
            ...habit,
            isCompleted: habit.is_completed === 1, // Map is_completed to isCompleted
          }));

          setHabits(fetchedHabits);

          if (fetchedHabits.length === 1) {
            setSelectedHabit(fetchedHabits[0]);
          }
        } else {
          console.error("Error fetching habits:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    fetchHabits();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      function getMonth(date) {
        return date.toLocaleString("default", { month: "long" });
      }
      const checkBadgeUnlock = (habitScoresByMonth, earnedBadges) => {
        const unlockedBadges = [];

        console.log("testas");
        for (const month in habitScoresByMonth) {
          const habitScore = habitScoresByMonth[month];

          // Check against each earned badge
          earnedBadges.forEach((badge) => {
            if (badge.threshold <= habitScore) {
              // Check if the badge is not already unlocked
              if (!badge.is_shown) {
                unlockedBadges.push({
                  ...badge,
                  is_shown: 1, // Mark the badge as unlocked
                });
              }
            }
          });
        }

        return unlockedBadges;
      };

      if (selectedHabit) {
        try {
          const response = await axios.get(
            `http://localhost:3200/api/getCalendarDays?habitId=${selectedHabit.id}`
          );

          // Process the response data and set the chart data and options
          const fetchedCalendarDays = response.data.calendarDays;
          const markedDates = {};

          // Calculate the completion count for each month based on the background color
          const completionCountByMonth = {}; // Track completion count for each month
          const incompletionCountByMonth = {}; // Track incompletion count for each month
          const streakCountByMonth = {}; // Track streak count for each month

          const { longestStreak, longestStreakStartDate } =
            calculateStreak(fetchedCalendarDays);

          fetchedCalendarDays.forEach((day) => {
            const date = new Date(day.date);
            const month = getMonth(date);
            const formattedDate = date.toISOString().split("T")[0];
            markedDates[formattedDate] = day.background_color;

            if (day.background_color === "bg-green-500") {
              completionCountByMonth[month] =
                (completionCountByMonth[month] || 0) + 1;
              const prevStreakCount = streakCountByMonth[month] || 0;
              streakCountByMonth[month] = prevStreakCount + 1;
            } else if (day.background_color === "bg-red-500") {
              incompletionCountByMonth[month] =
                (incompletionCountByMonth[month] || 0) + 1;
              streakCountByMonth[month] = 0;
            }
          });

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

          const completionCountsByMonth = months.map(
            (month) => completionCountByMonth[month] || 0
          );

          const incompletionCountsByMonth = months.map(
            (month) => incompletionCountByMonth[month] || 0
          );

          const streakCountsByMonth = months.map(
            (month) => streakCountByMonth[month] || 0
          );

          const habitScoresByMonth = calculateHabitScore(
            completionCountByMonth,
            incompletionCountByMonth,
            streakCountByMonth
          );
          //
          const unlockedBadges = checkBadgeUnlock(
            habitScoresByMonth,
            earnedBadges
          );

          if (unlockedBadges.length > 0) {
            setUnlockedBadges(unlockedBadges); // Set unlocked badges in state (if needed)

            // Create a new array with all badges (unlocked + remaining locked badges)
            const updatedEarnedBadges = [
              ...earnedBadges.filter(
                (badge) =>
                  !unlockedBadges.some(
                    (unlockedBadge) => unlockedBadge.badge_id === badge.badge_id
                  )
              ),
              ...unlockedBadges,
            ];

            // Update the is_shown status for unlocked badges in the earnedBadges array

            setEarnedBadges(updatedEarnedBadges);

            // Make the API call to update the database with the unlocked badges
            try {
              await Promise.all(
                unlockedBadges.map((badge) => {
                  return axios.post(
                    "http://localhost:3200/api/updateBadgeIsShown",
                    {
                      badge_id: badge.badge_id,
                      is_shown: 1, // Set is_shown to true for unlocked badges
                    }
                  );
                })
              );
              console.log(
                "Badge is_shown updated for unlocked badges:",
                unlockedBadges
              );
            } catch (error) {
              console.error(
                "Error updating badge is_shown for unlocked badges:",
                error
              );
            }
          }
          const habitScoresData = Object.keys(habitScoresByMonth).map(
            (month) => habitScoresByMonth[month]
          );

          const data = {
            datasets: [
              {
                label: "Completion Count by Months",
                data: completionCountsByMonth,
                backgroundColor: "rgba(75, 192, 0.2)",
                borderColor: "rgba(192, 75, 192, 1)",
                borderWidth: 2,
              },
              {
                label: "Incompletion Count",
                data: incompletionCountsByMonth,
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                borderColor: "rgba(255, 0, 0, 1)",
                borderWidth: 2,
              },
              {
                label: "Streak Count",
                data: showStreak ? streakCountsByMonth : [],
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderColor: "rgba(0, 0, 255, 1)",
                borderWidth: 2,
              },
              {
                label: "Habit Score",
                data: showStrength ? habitScoresData : [],
                backgroundColor: showStrength
                  ? "rgba(255, 165, 0, 0.2)"
                  : "rgba(0, 0, 0, 0)", // Set transparent background when showStrength is false
                borderColor: showStrength
                  ? "rgba(255, 165, 0, 1)"
                  : "rgba(0, 0, 0, 0)", // Set transparent border when showStrength is false
                borderWidth: 2,
              },
            ],
            labels: months,
          };

          const options = {
            scales: {
              x: {
                type: "category",
                title: {
                  display: true,
                  text: "Months",
                },
                grid: {
                  display: true,
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Completion Count",
                },
                grid: {
                  display: true,
                },
                min: 0,
                max: Math.max(
                  ...completionCountsByMonth,
                  ...incompletionCountsByMonth
                ),
              },
            },
          };

          setParentChartData(data);
          setParentChartOptions(options);
          setStreak({ longestStreak, longestStreakStartDate });
          setHabitScores(habitScoresByMonth);
        } catch (error) {
          console.error("Error fetching chart data:", error);
        }
      }
    };

    fetchChartData();
  }, [selectedHabit, showStreak, showStrength]);

  const calculateStreak = (calendarDays) => {
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
      longestStreakStartDate: longestStreakStartDate || new Date(), // Provide a default date value if longestStreakStartDate is null
    };
  };

  const calculateHabitScore = (
    completionCountByMonth,
    incompletionCountByMonth,
    streakCountByMonth
  ) => {
    const weightedCompletion = 0.6; // Weight for completion count
    const weightedIncompletion = 0.3; // Weight for incompletion count
    const weightedStreak = 0.1; // Weight for streak count

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

    const habitScores = {};

    months.forEach((month) => {
      const completionCount = completionCountByMonth[month] || 0;
      const incompletionCount = incompletionCountByMonth[month] || 0;
      const streakCount = streakCountByMonth[month] || 0;

      const habitScore =
        completionCount * weightedCompletion +
        incompletionCount * weightedIncompletion +
        streakCount * weightedStreak;

      habitScores[month] = habitScore.toFixed(2);
    });

    return habitScores;
  };

  const handleDelete = async (habitId) => {
    if (habitId) {
      try {
        // Send a DELETE request to the server to delete the habit
        const response = await axios.delete(
          `http://localhost:3200/api/habitas/${habitId}`
        );

        if (response.data.success) {
          console.log("deleted was sucesfull send");
          const updatedHabits = habits.filter((habit) => habit.id !== habitId);
          setHabits(updatedHabits);
          setSelectedHabit(null);
        } else {
          console.error("Error deleting habit:", response.data.error);
        }
      } catch (error) {
        console.error("Error deleting habit:", error);
      }
    }
  };

  const handleCompleted = async () => {
    if (selectedHabit) {
      const updatedSelectedHabit = {
        ...selectedHabit,
        isCompleted: !selectedHabit.isCompleted,
      };
      console.log(selectedHabit.isCompleted);
      // Update the completed state in the database
      try {
        await axios.put(
          `http://localhost:3200/api/completeHabit/${selectedHabit.id}`,
          {
            isCompleted: updatedSelectedHabit.isCompleted,
          }
        );
        // The update was successful

        const updatedHabits = habits.map((habit) => {
          if (habit === selectedHabit) {
            return updatedSelectedHabit;
          }
          return habit;
        });

        setHabits(updatedHabits);
        setSelectedHabit(updatedSelectedHabit);
      } catch (error) {
        // Handle the error
      }
    }
  };
  const handleEdit = async () => {
    if (selectedHabit) {
      const updatedSelectedHabit = {
        ...selectedHabit,
        name: newHabit,
        frequency,
        reminder,
        category,
        description,
      };

      try {
        const response = await axios.put(
          `http://localhost:3200/api/habits/${selectedHabit.id}`,
          updatedSelectedHabit
        );

        if (response.data.success) {
          const updatedHabits = habits.map((habit) => {
            if (habit.id === selectedHabit.id) {
              return updatedSelectedHabit;
            }
            return habit;
          });
          setHabits(updatedHabits);
          setSelectedHabit(updatedSelectedHabit);
          console.log("Habit updated successfully.");
        } else {
          console.error("Error updating habit:", response.data.error);
        }
      } catch (error) {
        console.error("Error updating habit:", error);
      }
    }
  };

  return (
    <div className=" z-10 container mx-auto py-6">
      {showBadgeModal && unlockedBadges.length > 0 && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-4 w-1/2 md:w-1/3 lg:w-1/4 text-center border border-black">
            <h3 className="text-xl font-bold mb-4">
              Congratulations! You have unlocked a new badge:
            </h3>
            <img
              src={unlockedBadges[0].badge_image_path}
              width={70}
              alt={unlockedBadges[0].badge_name}
              className="mx-auto mb-4"
            />
            <p>You can use the badge as a profile image now!</p>
            <button className="mt-4" onClick={handleCloseBadge}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-500">Habit Tracker</h1>
        <button
          className="bg-gray-100 hover:bg-green-500 hover:text-white px-3 py-2 rounded"
          onClick={() => setShowAddHabit(true)}
        >
          Add Habit
        </button>
      </div>
      {showAddHabit && (
        <div className="fixed top-0 left-0 h-screen w-screen  flex justify-center items-center z-50">
          <div className="bg-white p-4 md:p-8 rounded shadow-lg w-full max-w-md z-20">
            <div
              className="text-xl text-right pb-3"
              onClick={() => {
                setShowAddHabit(false);
              }}
            >
              X
            </div>
            <input
              type="text"
              placeholder="Enter habit"
              className="border rounded-l px-2 py-1 mb-2 w-full"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
            />

            <div className="flex mb-2">
              <label className="mr-2">Frequency:</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Reminder"
              className="border rounded px-2 py-1 mb-2 w-full"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            />
            <div className="flex mb-2">
              <label className="mr-2">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="health">Health</option>
                <option value="fitness">Fitness</option>
                <option value="education">Education</option>
                <option value="productivity">Productivity</option>
                <option value="finance">Finance</option>
                <option value="relationships">Relationships</option>
                <option value="spiritual">Spiritual</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Description"
              className="break-words border rounded px-2 py-1 mb-2 w-full  max-h-max resize"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded w-full"
              onClick={handleAddHabit}
            >
              Add
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto py-6">
        <div className="flex mt-6 mb-2">
          {habits.map((habit) => (
            <button
              key={habit.name}
              className={`bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded mx-2 ${
                selectedHabit === habit && "bg-green-500 text-white"
              }`}
              onClick={() => handleHabitSelect(habit)}
            >
              {habit.name}
            </button>
          ))}
        </div>
        {/* dalis kur viskas surasyta apie habita paspaudus ant jo */}

        {selectedHabit && (
          <div
            className={`border p-4 ${
              selectedHabit.isCompleted ? "bg-green-300" : ""
            }`}
          >
            <div className="flex justify-end">
              <div>
                <button onClick={handleCalenderClick} className="p-1">
                  <FontAwesomeIcon
                    onClick={setShowCalendar}
                    icon={faCalendarAlt}
                    className="block text-blue-600"
                  />
                </button>
              </div>
              <button className="p-1 px-3" onClick={handleChartClick}>
                <FontAwesomeIcon
                  onClick={setShowChart}
                  icon={faChartSimple}
                  className="block text-grey-500 text-blue-600"
                />
              </button>
              <button>
                <FontAwesomeIcon
                  icon={faShare}
                  className="block text-blue-600"
                />
              </button>
            </div>
            <h2 className="font-bold text-lg">
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Enter habit name"
                  className="border rounded px-2 py-1 mb-2 w-full"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                />
              ) : (
                selectedHabit.name
              )}
            </h2>
            {isEditing && (
              <>
                <div className="flex mb-2">
                  <label className="mr-2">Frequency:</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Enter reminder"
                  className="border rounded px-2 py-1 mb-2 w-full"
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                />
                <div className="flex mb-2">
                  <label className="mr-2">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="health">Health</option>
                    <option value="fitness">Fitness</option>
                    <option value="education">Education</option>
                    <option value="productivity">Productivity</option>
                    <option value="finance">Finance</option>
                    <option value="relationships">Relationships</option>
                    <option value="spiritual">Spiritual</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Enter habit description"
                  className="flex border rounded px-2 py-1 mb-2 w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </>
            )}
            {!isEditing && (
              <p className="text-gray-600">
                Description: {selectedHabit.description}
              </p>
            )}
            {!isEditing && (
              <p className="text-gray-600">
                Frequency: {selectedHabit.frequency}
              </p>
            )}
            {!isEditing && (
              <p className="text-gray-600">
                Reminder: {selectedHabit.reminder}
              </p>
            )}
            {!isEditing && (
              <p className="text-gray-600">
                Category: {selectedHabit.category}
              </p>
            )}
            <div className="flex justify-end">
              {isEditing ? (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded w-full"
                  onClick={() => {
                    setIsEditing(false);
                    handleEdit();
                  }}
                >
                  Save
                </button>
              ) : (
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(selectedHabit.id)}
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleCompleted}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs"
                  >
                    {selectedHabit && selectedHabit.isCompleted
                      ? "Completed ✓"
                      : "Completed"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {showCalendar && (
          <div className="fixed top-0 left-0 h-screen w-screen opacity-100 flex justify-center items-center z-100">
            <HabitCalendar
              setShowCalendar={setShowCalendar}
              habitId={selectedHabit ? selectedHabit.id : null}
              userId={selectedHabit ? selectedHabit.user_id : null}
              setParentChartData={updateChartData}
              setParentChartOptions={updateChartOptions}
            />
          </div>
        )}
      </div>
      {showChart && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-full sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-5/12 bg-white text-black text-center border border-black rounded-lg shadow-md p-4 space-y-4">
            <ChartComponent
              setShowChart={setShowChart}
              data={parentChartData}
              options={parentChartOptions}
              chartDisplay={chartDisplay}
              onChartDisplayChange={handleChartDisplayChange}
            />
            <div className="flex justify-center space-x-4 mb-4">
              <button
                className={`px-4 py-2 font-semibold ${
                  displayStreak ? "bg-blue-500 text-white" : "bg-gray-200"
                } rounded`}
                onClick={handleDisplayStreak}
              >
                Show Streak
              </button>
              <button
                className={`px-4 py-2 font-semibold ${
                  showStrength ? "bg-blue-500 text-white" : "bg-gray-200"
                } rounded`}
                onClick={handleDisplayStrenght}
              >
                Habit Strength
              </button>
            </div>
            {displayStreak && (
              <div className="border border-black p-3 rounded bg-gray-100 border-t-2 border-b-2">
                <p className="font-medium mb-2">
                  Longest Streak: {streak ? streak.longestStreak : 0} days
                </p>
                {streak && (
                  <p>
                    Streak Start Date:{" "}
                    {streak.longestStreakStartDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            {showStrength && (
              <div className="mt-4">
                {areAnyHabitScoresGreaterThanZero ? (
                  <div>
                    <h2 className="font-medium mb-2">Habit Scores:</h2>
                    <ul className="border border-black grid grid-cols-2 gap-2">
                      {Object.keys(habitScores)
                        .slice(
                          scorePage * scoresPerPage,
                          (scorePage + 1) * scoresPerPage
                        )
                        .map((month) => {
                          const habitScore = habitScores[month];
                          if (habitScore !== "0.00") {
                            return (
                              <li
                                key={month}
                                className="border p-2 rounded bg-gray-100"
                              >
                                <span>{month}:</span> {habitScore}
                              </li>
                            );
                          }
                          return null;
                        })}
                    </ul>
                    <div className="mt-2 flex justify-between items-center">
                      {scorePage > 0 && (
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded"
                          onClick={() => setScorePage(scorePage - 1)}
                        >
                          Previous
                        </button>
                      )}
                      <div className="ml-auto">
                        {Object.keys(habitScores).length >
                          (scorePage + 1) * scoresPerPage && (
                          <button
                            className="bg-blue-500 text-white py-1 px-3 rounded"
                            onClick={() => setScorePage(scorePage + 1)}
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-2 border border-black p-2 rounded bg-gray-100">
                    Nothing to be shown yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
