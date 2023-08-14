import React from "react";
import HabitCalendar from "../components/celender";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/header";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faChartSimple,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { useHabitContext } from "../components/habitContext";
import GoalHabitAssociate from "../components/goalHabitAssociate/goalHabitAssociate";

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [reminder, setReminder] = useState("");
  const [category, setCategory] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { habits, setHabits } = useHabitContext();

  //
  const [associatedHabits, setAssociatedHabits] = useState([]);
  const [showAssociateHabits, setShowAssociateHabits] = useState(false);
  const [goalHasAssociatedHabits, setGoalHasAssociatedHabits] = useState(false);
  const [goalHabitsAssociated, setGoalHabitsAssociated] = useState(false);

  //

  const [selectedHabits, setSelectedHabits] = useState({});

  const [hasSelectedHabits, setHasSelectedHabits] = useState(false);

  const handleContinueClick = async () => {
    if (Object.keys(selectedHabits?.[selectedGoal?.id] || {}).length > 0) {
      // At least one habit has been selected, save them to the database
      const habitIds = Object.keys(selectedHabits[selectedGoal.id]).filter(
        (habitId) => selectedHabits[selectedGoal.id][habitId]
      );
      await saveSelectedHabitsToDB(habitIds);
      setAssociatedHabits(habitIds);

      setGoalHasAssociatedHabits(habitIds.length > 0); // Update based on the length of habitIds
      setHasSelectedHabits(true);
      setGoalHabitsAssociated(true);
      setShowAssociateHabits(false);
    } else {
      // No habits have been selected, show a message
      console.log("Please select at least one habit before continuing.");
      setHasSelectedHabits(false);
      setGoalHasAssociatedHabits(false); // Update the state to false when there are no associated habits
    }
  };

  const fetchAssociatedHabits = async (goalId) => {
    console.log("feching assoc goals");
    try {
      const response = await fetchGoalAssociation(goalId);
      if (response.success) {
        const habits = response.associatedHabits;
        setAssociatedHabits(habits);
        setGoalHasAssociatedHabits(habits.length > 0);
      } else {
        console.log("Error fetching associated habits:", response.error);
        setAssociatedHabits([]);
        setGoalHasAssociatedHabits(false);
      }
    } catch (error) {
      console.error("Error while fetching associated habits:", error);
      setAssociatedHabits([]);
      setGoalHasAssociatedHabits(false);
    }
  };

  useEffect(() => {
    if (selectedGoal) {
      fetchAssociatedHabits(selectedGoal.id);
    }
  }, [selectedGoal]);

  const saveSelectedHabitsToDB = async (habitIds) => {
    try {
      const habitIdsJson = JSON.stringify(habitIds); // Convert to JSON string
      const response = await axios.post(
        "http://localhost:3200/api/setGoalAssociate",
        {
          userId: selectedGoal.user_id,
          goalId: selectedGoal.id,
          habitIds: habitIdsJson, // Use the JSON string here
        }
      );

      // Rest of the code...
    } catch (error) {
      console.error("Error while saving selected habits:", error);
      // Add error handling here if needed
    }
  };

  const handleHabitClick = (habitId) => {
    setSelectedHabits((prevSelectedHabits) => {
      const selectedHabitsForGoal = prevSelectedHabits[selectedGoal?.id] || {};
      const updatedHabitsForGoal = {
        ...selectedHabitsForGoal,
        [habitId]: !selectedHabitsForGoal[habitId],
      };
      // Remove the habit from the object if it's being deselected
      if (!updatedHabitsForGoal[habitId]) {
        delete updatedHabitsForGoal[habitId];
      }
      return {
        ...prevSelectedHabits,
        [selectedGoal?.id]: updatedHabitsForGoal,
      };
    });
  };

  const handleAssociateClick = async () => {
    if (goalHasAssociatedHabits) {
      // Goal has associated habits, render the GoalHabitAssociate component
      setShowAssociateHabits(false);
      setGoalHabitsAssociated(true);
    } else {
      // If showAssociateHabits is true, clear the selectedHabits array
      if (showAssociateHabits) {
        setSelectedHabits({});
      }
      setShowAssociateHabits(!showAssociateHabits);
      setGoalHabitsAssociated(false); // Set goalHabitsAssociated to false when showing "showAssociateHabits"
    }
  };

  const fetchGoalAssociation = async (goalId) => {
    try {
      const response = await axios.get(
        `http://localhost:3200/api/getGoalAssociation/${goalId}`
      );

      return response.data; // Return the entire response data object
    } catch (error) {
      console.error("Error while fetching goal association:", error);
      return { success: false, associatedHabits: [] }; // Return a default object with success false and empty habits array
    }
  };

  const handleHabitSelect = async (goal) => {
    if (selectedGoal === goal) {
      setSelectedGoal(null);
    } else {
      setSelectedGoal(goal);

      try {
        // Fetch associated habits for the selected goal
        const response = await fetchGoalAssociation(goal.id);
        if (response.success) {
          const associatedHabits = response.associatedHabits;
          setSelectedHabits({ [goal.id]: associatedHabits });
          setAssociatedHabits(associatedHabits);

          // Set goalHasAssociatedHabits to true if there are associated habits

          setGoalHasAssociatedHabits(associatedHabits.length > 0);
          console.log(associatedHabits.length);
        } else {
          // Handle the case when there was an error or no associated habits found
          console.log("Error fetching associated habits:", response.error);
          setSelectedHabits({ [goal.id]: [] });

          // Set goalHasAssociatedHabits to false if there are no associated habits
          setGoalHasAssociatedHabits(false);
        }
      } catch (error) {
        console.error("Error while fetching associated habits:", error);
        setSelectedHabits({ [goal.id]: [] });

        // Set goalHasAssociatedHabits to false if there was an error

        setGoalHasAssociatedHabits(false);
        setAssociatedHabits([]);
      }
    }
  };

  useEffect(() => {
    if (goals.length === 1) {
      setSelectedGoal(goals[0]);
    }
  }, [goals]);

  const handleCloseGoalHabitAssociate = () => {
    setGoalHabitsAssociated(false);
  };

  const handleAddGoal = async () => {
    if (newGoal) {
      const newGoalObject = {
        name: newGoal,
        description,
        frequency,
        reminder,
        category,
        isCompleted,
        fromDate,
        toDate,
      };

      try {
        const response = await axios.post(
          "http://localhost:3200/api/goals",
          newGoalObject
        );
        if (response.data.success) {
          const createdGoal = response.data;
          const goalId = createdGoal.goalId;

          const goalWithId = { ...newGoalObject, id: goalId };

          setGoals([...goals, goalWithId]);
          setNewGoal("");
          setDescription("");
          setFrequency("daily");
          setReminder("");
          setCategory("");
          setShowAddGoal(false);
          setFromDate("");
          setToDate("");
        } else {
          console.error("Error adding goal", response.data.error);
        }
      } catch (error) {
        console.error("Error adding goal", error);
      }
    }
  };

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get("http://localhost:3200/api/getHabits");
        if (response.data.success) {
          const fetchedHabits = response.data.habits.map((habit) => ({
            ...habit,
            isCompleted: habit.is_completed === 1,
          }));
          console.log("Fetched habits:", fetchedHabits);
          setHabits(fetchedHabits);
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
    const fetchGoals = async () => {
      const fromDate = new Date();
      const formattedDate = fromDate.toLocaleDateString();

      const toDate = new Date();
      const formattedToDate = fromDate.toLocaleDateString();

      try {
        const response = await axios.get("http://localhost:3200/api/getGoals");
        if (response.data.success) {
          const fetchedGoals = response.data.goals.map((goal) => ({
            ...goal,
            isCompleted: goal.is_completed === 1,
            fromDate: formattedDate,
            toDate: formattedToDate,
          }));

          setGoals(fetchedGoals);
          if (fetchedGoals.length === 1) {
            setSelectedGoal(fetchedGoals[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching goals catched error:", error);
      }
    };
    fetchGoals();
  }, []);

  const handleDelete = async (goalId) => {
    if (goalId) {
      console.log(goalId);

      try {
        const response = await axios.delete(
          `http://localhost:3200/api/goalas/${goalId}`
        );

        if (response.data.success) {
          console.log("deleted was sucessfully send");
          const updatedGoals = goals.filter((goal) => goal.id !== goalId);
          setGoals(updatedGoals);
          setSelectedGoal(null);
        } else {
          console.error("Error deleteting goal:", response.data.error);
        }
      } catch (error) {
        console.error("Error deleting goal", error);
      }
    }
  };

  const handleCompleted = async () => {
    if (selectedGoal) {
      const updatedSelectedGoal = {
        ...selectedGoal,
        isCompleted: !selectedGoal.isCompleted,
      };

      try {
        await axios.put(
          `http://localhost:3200/api/completedGoal/${selectedGoal.id}`,
          {
            isCompleted: updatedSelectedGoal.isCompleted,
          }
        );

        const updatedGoals = goals.map((goal) => {
          if (goal === selectedGoal) {
            return updatedSelectedGoal;
          }
          return goal;
        });
        setGoals(updatedGoals);
        setSelectedGoal(updatedSelectedGoal);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = async () => {
    if (selectedGoal) {
      const updatedSelectedGoal = {
        ...selectedGoal,
        name: newGoal,
        description,
        frequency,
        reminder,
        fromDate,
        toDate,
        category,
      };

      try {
        const response = await axios.put(
          `http://localhost:3200/api/goals/${selectedGoal.id}`,
          updatedSelectedGoal
        );

        if (response.data.success) {
          const updatedGoals = goals.map((goal) => {
            if (goal.id === selectedGoal.id) {
              return updatedSelectedGoal;
            }
            return goal;
          });
          setGoals(updatedGoals);
          setSelectedGoal(updatedSelectedGoal);
          console.log("goal updated successfully");
        } else {
          console.error("Erro updating goals", response.data.error);
        }
      } catch (error) {
        console.error("Error updating goals", error);
      }
    }
  };
  return (
    <>
      <Header />
      <div className=" z-10 container mx-auto py-6">
        <div>
          {showAssociateHabits && !goalHasAssociatedHabits && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
              <div className="w-3/4 h-3/4 bg-white p-6 rounded-lg shadow-lg">
                <button
                  onClick={handleAssociateClick}
                  className="text-gray-600 hover:text-gray-800"
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

                <h2 className="text-xl font-bold my-4">
                  Choose habits you want to associate your goal with:
                </h2>

                <div className="flex flex-wrap -mx-2">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className={`cursor-pointer p-2 mb-2 mx-2 border rounded-lg border-gray-300 ${
                        selectedHabits?.[selectedGoal?.id]?.[habit.id]
                          ? "bg-green-500 text-white"
                          : "bg-white"
                      }`}
                      onClick={() => handleHabitClick(habit.id)}
                    >
                      {habit.name}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleContinueClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
                >
                  Continue
                </button>

                {!hasSelectedHabits && (
                  <div className="text-red-500 mt-2">
                    Please select at least one habit before continuing.
                  </div>
                )}
              </div>
            </div>
          )}

          {goalHabitsAssociated && associatedHabits && (
            <GoalHabitAssociate
              onClose={handleCloseGoalHabitAssociate}
              associatedHabits={associatedHabits}
              setAssociatedHabits={setAssociatedHabits}
              selectedGoalId={selectedGoal.id} // Pass the selectedGoal.id as a prop
            />
          )}
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-500">Goal Tracker</h1>
          <button
            className="bg-gray-100 hover:bg-green-500 hover:text-white px-3 py-2 rounded"
            onClick={() => setShowAddGoal(true)}
          >
            Add Goal
          </button>
        </div>
        {showAddGoal && (
          <div className="fixed top-0 left-0 h-screen w-screen   flex justify-center items-center z-50">
            <div className="bg-white p-4 md:p-8 rounded shadow-lg w-full max-w-md">
              <div
                className="text-xl text-right pb-3"
                onClick={() => {
                  setShowAddGoal(false);
                }}
              >
                X
              </div>
              <input
                type="text"
                placeholder="Enter "
                className="border rounded-l px-2 py-1 mb-2 w-full"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description"
                className="border rounded px-2 py-1 mb-2 w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex mb-2">
                <label className="mr-2">From:</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="flex mb-2">
                <label className="mr-2">To:</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
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
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded w-full"
                onClick={handleAddGoal}
              >
                Add
              </button>
            </div>
          </div>
        )}
        <div className="container mx-auto py-6">
          <div className="flex mt-6 mb-2">
            {goals.map((habit) => (
              <button
                key={habit.name}
                className={`bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded mx-2 ${
                  selectedGoal === habit && "bg-green-500 text-white"
                }`}
                onClick={() => handleHabitSelect(habit)}
              >
                {habit.name}
              </button>
            ))}
          </div>
          {/* dalis kur viskas surasyta apie habita paspaudus ant jo */}

          {selectedGoal && (
            <div
              className={`border p-4 ${
                selectedGoal && selectedGoal.isCompleted ? "bg-green-300" : ""
              }`}
            >
              <div className="flex justify-end">
                <button className="p-1 px-3">
                  <FontAwesomeIcon
                    icon={faChartSimple}
                    onClick={handleAssociateClick}
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
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                  />
                ) : (
                  selectedGoal.name
                )}
              </h2>
              {isEditing && (
                <>
                  <input
                    type="text"
                    placeholder="Enter habit description"
                    className="border rounded px-2 py-1 mb-2 w-full"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                </>
              )}
              {!isEditing && (
                <p className="text-gray-600">
                  Description: {selectedGoal.description}
                </p>
              )}

              {!isEditing && (
                <p className="text-gray-600">
                  Frequency: {selectedGoal.frequency}
                </p>
              )}
              {!isEditing && (
                <p className="text-gray-600">
                  Reminder: {selectedGoal.reminder}
                </p>
              )}
              {!isEditing && (
                <p className="text-gray-600">
                  Category: {selectedGoal.category}
                </p>
              )}

              {!isEditing && (
                <div>
                  <p className="text-gray-600">From: {selectedGoal.fromDate}</p>
                  <p className="text-gray-600">To: {selectedGoal.toDate}</p>
                </div>
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
                      onClick={() => handleDelete(selectedGoal.id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleCompleted}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs"
                    >
                      {selectedGoal && selectedGoal.isCompleted
                        ? "Completed ✓"
                        : "Completed"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GoalTracker;

// Add Reminders: Allow users to set reminders for their goals. Reminders can be scheduled at specific intervals or based on certain events, such as daily, weekly, or monthly reminders. This helps users stay focused and motivated to work towards their goals consistently.

// Provide Motivational Quotes or Tips: Include a feature that offers users motivational quotes or tips related to their goals. This can provide inspiration, encouragement, and helpful insights to keep users motivated and engaged in their goal-setting journey.

// Celebrate Achievements: Celebrate users' achievements when they reach significant milestones or successfully accomplish their goals. This can be done through notifications, congratulatory messages, or virtual rewards. Acknowledging their progress and accomplishments can boost motivation and encourage users to continue pursuing their goals.

// Share Goals and Progress: Allow users to share their goals and progress with others. This can be done through social media integration or within a community of like-minded individuals. Users can inspire and support each other, share tips, and celebrate each other's successes.

// Provide Insights and Analytics: Offer users insights and analytics related to their goals. This can include data on their progress over time, patterns in goal achievement, comparisons with previous goals, and recommendations for improvement. Providing actionable insights can help users make informed decisions and optimize their goal-setting strategies.
