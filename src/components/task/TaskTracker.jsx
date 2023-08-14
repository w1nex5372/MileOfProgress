import React, { useState, useEffect } from "react";
import pomidoras from "../../img/red.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChartSimple,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PomodoroTimer from "../pomodoro";
const categories = [
  "Work",
  "Personal",
  "Education",
  "Health",
  "Finance",
  "Home",
  "Fitness",
  "Social",
  "Travel",
  "Errands",
  "Projects",
  "Hobbies",
];

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  const [category, setCategory] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPomedor, setShowPomedor] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showFilterSorting, setShowFilterSorting] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const [showStats, setShowStats] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [longestSession, setLongestSession] = useState(0); // State for longest session

  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [totalUncompletedTasks, setTotalUncompletedTasks] = useState(0);
  const [priorityCounts, setPriorityCounts] = useState({
    low: 0,
    medium: 0,
    high: 0,
  });

  // Function to format time based on total minutes
  const formatTime = (minutes) => {
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = minutes % 60;

    let formattedTime = "";
    if (days > 0) {
      formattedTime += `${days} day${days > 1 ? "s" : ""} `;
    }
    if (hours > 0) {
      formattedTime += `${hours} hour${hours > 1 ? "s" : ""} `;
    }
    if (mins > 0) {
      formattedTime += `${mins} minute${mins > 1 ? "s" : ""}`;
    }

    return formattedTime.trim();
  };
  const handleStatsClick = () => {
    const completedTasks = tasks.filter((task) => task.is_completed === 1);
    setTotalCompletedTasks(completedTasks.length);

    const uncompletedTasks = tasks.filter((task) => task.is_completed === 0);
    setTotalUncompletedTasks(uncompletedTasks.length);

    const updatedPriorityCounts = { ...priorityCounts }; // Create a copy of the object
    tasks.forEach((task) => {
      const priority = task.priority.toLowerCase();
      updatedPriorityCounts[priority]++;
    });
    setPriorityCounts(updatedPriorityCounts);

    tasks.forEach((task) => {
      const priority = task.priority.toLowerCase();
      priorityCounts[priority]++;
    });

    setShowStats(!showStats);
  };

  const handleShowNotes = async () => {
    setShowNotes(!showNotes);

    if (!showNotes && selectedTask) {
      const response = await fetchNotes(selectedTask.id);

      if (response.success) {
        if (response.notes.length > 0) {
          setNoteContent(response.notes[0].note_content);
        } else {
          setNoteContent(""); // Set noteContent to empty string if there are no notes
        }
      }
    }
  };

  const fetchTotalTimeSpent = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3200/api/getTotalTimeSpent"
      );

      if (response.data.success) {
        // Convert seconds to minutes
        const totalTimeInMinutes = Math.floor(
          response.data.totalTimeSpent / 60
        );
        setTotalTimeSpent(totalTimeInMinutes);

        const longestSessionInMinutes = Math.floor(
          response.data.longestSession / 60
        );

        // Set longest session from the response
        setLongestSession(longestSessionInMinutes);
      } else {
        console.error("Error fetching total time spent:", response.data.error);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  useEffect(() => {
    if (showStats) {
      fetchTotalTimeSpent();
    }
  }, [showStats]);

  const handleNoteChange = (e) => {
    setNoteContent(e.target.value);
  };

  const fetchNotes = async (taskId) => {
    try {
      const response = await axios.get(
        `http://localhost:3200/api/getNotes/${taskId}`
      );

      return response.data;
    } catch (error) {
      console.error("API call failed:", error);
      return { success: false, error: "API call failed" };
    }
  };

  const handleSaveNote = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3200/api/saveNote/${selectedTask.id}`,
        { noteContent }
      );
      if (response.data.success) {
        console.log("Data has been saved.");
      } else {
        console.error("Error saving note:", response.data.error);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const handleCloseNotes = () => {
    setShowNotes(false);
  };

  const handleRemoveAll = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3200/api/deleteNote/${selectedTask.id}`
      );

      if (response.data.success) {
        setNoteContent(""); // Clear the note content
        console.log("Row deleted successfully.");
      } else {
        console.error("Error deleting row:", response.data.error);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const handleShowFilter = () => {
    setShowFilterSorting(!showFilterSorting);
  };
  const getPriorityColor = (priority) => {
    if (priority === "low") {
      return "text-green-500";
    } else if (priority === "medium") {
      return "text-orange-500";
    } else if (priority === "high") {
      return "text-red-500";
    } else {
      return "";
    }
  };

  const handleTaskSelect = (task) => {
    if (selectedTask === task) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };

  useEffect(() => {
    if (tasks.length === 1) {
      setSelectedTask(tasks[0]);
    }
  }, [tasks]);

  const handlePomedorClick = () => {
    setShowPomedor(!showPomedor);
  };

  const handleAddTask = async () => {
    if (newTask) {
      const newTaskObject = {
        name: newTask,
        priority,
        category,
        isCompleted,
        description,
        toDate,
        fromDate,
      };

      try {
        const response = await axios.post(
          "http://localhost:3200/api/tasks",
          newTaskObject
        );
        if (response.data.success) {
          const createdTask = response.data;
          const taskId = createdTask.taskId;
          const taskWithId = { ...newTaskObject, id: taskId };
          console.log(taskWithId);
          setTasks([...tasks, taskWithId]);
          setNewTask("");
          setCategory("");
          setToDate("");
          setFromDate("");
          setPriority("low");

          setDescription("");
          setShowAddTask(false);
        } else {
          console.error("Error adding task:", response.data.error);
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const fromDate = new Date();
      const formattedDate = fromDate.toLocaleDateString();

      const toDate = new Date();
      const formattedToDate = fromDate.toLocaleDateString();
      try {
        const response = await axios.get("http://localhost:3200/api/getTasks");
        if (response.data.success) {
          const fetchedTasks = response.data.tasks.map((task) => ({
            ...task,
            isCompleted: task.is_completed === 1,
            fromDate: formattedDate,
            toDate: formattedToDate,
          }));

          setTasks(fetchedTasks);
          if (fetchedTasks.length === 1) {
            setSelectedTask(fetchedTasks[0]);
          }
        } else {
          console.error("Error fetching tasks:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    if (taskId) {
      console.log(taskId);
      try {
        const response = await axios.delete(
          `http://localhost:3200/api/taskas/${taskId}`
        );

        if (response.data.success) {
          console.log("Deletion was successful");
          const updatedTasks = tasks.filter((task) => task.id !== taskId);
          setTasks(updatedTasks);
          setSelectedTask(null);
        } else {
          console.error("Error deleting task:", response.data.error);
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleCompleted = async () => {
    if (selectedTask) {
      const updatedSelectedTask = {
        ...selectedTask,
        isCompleted: !selectedTask.isCompleted,
      };
      console.log(selectedTask.isCompleted);
      try {
        await axios.put(
          `http://localhost:3200/api/completeTask/${selectedTask.id}`,
          {
            isCompleted: updatedSelectedTask.isCompleted,
          }
        );

        const updatedTasks = tasks.map((task) => {
          if (task === selectedTask) {
            return updatedSelectedTask;
          }
          return task;
        });
        console.log(updatedTasks);
        setTasks(updatedTasks);
        setSelectedTask(updatedSelectedTask);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const handleEdit = async () => {
    if (selectedTask) {
      const updatedSelectedTask = {
        ...selectedTask,
        name: newTask,
        priority,
        category,
        description,
        toDate,
        fromDate,
      };

      try {
        const response = await axios.put(
          `http://localhost:3200/api/EditTask/${selectedTask.id}`,
          updatedSelectedTask
        );

        if (response.data.success) {
          const updatedTasks = tasks.map((task) => {
            if (task.id === selectedTask.id) {
              return updatedSelectedTask;
            }
            return task;
          });
          setTasks(updatedTasks);
          setSelectedTask(updatedSelectedTask);
          console.log("Task updated successfully.");
        } else {
          console.error("Error updating task:", response.data.error);
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };
  // Assuming you have fromDate and toDate state variables that are properly updated

  const filteredTasks = tasks.filter((task) => {
    if (filterOption === "completed") {
      return task.is_completed === 1;
    } else if (categoryFilter) {
      return task.category === categoryFilter;
    } else if (priorityFilter) {
      return task.priority === priorityFilter;
    }

    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = {
      low: 1,
      medium: 2,
      high: 3,
    };

    const priorityA = priorityOrder[a.priority] || 0;
    const priorityB = priorityOrder[b.priority] || 0;

    return priorityA - priorityB;
  });

  return (
    <div className=" z-10 container mx-auto py-6">
      {showStats && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 text-center">
          <div className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 h-3/4 bg-white p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Your Task Statistics</h2>
            <button
              onClick={handleStatsClick}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              X
            </button>
            <p>Total Completed Tasks: {totalCompletedTasks}</p>
            <p>Total Uncompleted Tasks: {totalUncompletedTasks}</p>
            <p>Total Pomodoro Timer Usage: {formatTime(totalTimeSpent)}</p>
            <p>Longest Session: {formatTime(longestSession)}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Tasks by Priority:</h3>
              <div className="flex flex-wrap justify-center">
                {Object.entries(priorityCounts).map(([priority, count]) => (
                  <div key={priority} className="border rounded p-2 mb-2 mr-2">
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}:{" "}
                    {count}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotes && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-3/4 h-3/4 bg-white p-6 rounded-lg shadow-lg">
            <textarea
              value={noteContent}
              onChange={handleNoteChange}
              className="w-full h-48 border p-2 mb-4"
              placeholder="Write your note here..."
            />
            <div className="flex flex-col md:flex-row gap-2 md:justify-between">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded w-full md:w-auto"
                onClick={handleCloseNotes}
              >
                Close
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded w-full md:w-auto"
                onClick={handleSaveNote}
              >
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded w-full md:w-auto"
                onClick={handleRemoveAll}
              >
                Remove All
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-500">Task Tracker</h1>
        <div className="flex items-center space-x-2">
          <button
            className="bg-gray-100 hover:bg-green-500 hover:text-white px-3 py-2 rounded m-1"
            onClick={() => setShowAddTask(true)}
          >
            Add Task
          </button>
        </div>
      </div>
      <div className="flex justify-end p-1">
        <div
          className="bg-gray-100 hover:bg-green-500 hover:text-white p-1 px-3 border rounded"
          onClick={handleShowFilter}
        >
          Filter & sorting
        </div>
        <button className="bg-gray-100 hover:bg-green-500 hover:text-white p-1 px-3 border rounded text-3xl ">
          <FontAwesomeIcon
            icon={faChartSimple}
            onClick={handleStatsClick}
            className="block text-grey-500 "
          />
        </button>
      </div>
      {showFilterSorting && (
        <div className="border border-black m-5 p-4 flex flex-col md:flex-row justify-center items-center md:space-x-4">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="border border-gray-400 rounded py-2 px-4 w-full md:w-50"
          >
            <option value="">All Tasks</option>
            <option value="completed">Completed Tasks</option>
            {/* Add more filter options based on your requirements */}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-400 rounded py-2 px-4 w-full md:w-50 mt-2 md:mt-0"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>

            {/* Add more sort options based on your requirements */}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-400 rounded py-2 px-4 w-full md:w-50 mt-2 md:mt-0"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* forma kuria user turi uzpildyti paspaudziant addTask */}
      {showAddTask && (
        <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center z-50">
          <div className="bg-white p-4 md:p-8 rounded shadow-lg w-full max-w-md">
            <div
              className=" text-xl text-right pb-3"
              onClick={() => {
                setShowAddTask(false);
              }}
            >
              X
            </div>

            <input
              type="text"
              placeholder="Enter task"
              className="border rounded-l px-2 py-1 mb-2 w-full"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="flex mb-2">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-400 rounded py-2 px-4 w-full"
              />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-400 rounded py-2 px-4 w-full"
              />
            </div>
            <div className="flex mb-2">
              <div>priority</div>
              <select
                value={priority}
                placeholder=""
                onChange={(e) => {
                  setPriority(e.target.value);
                }}
                className="border border-gray-400 rounded py-2 px-4 w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex mb-2">
              <label className="mr-2">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
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
              onClick={handleAddTask}
            >
              Add
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto py-6">
        <div className="flex mt-6 mb-2">
          {sortedTasks.map((task) => (
            <button
              key={task.name}
              className={`bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded mx-2 ${
                selectedTask === task && "bg-green-500 text-white"
              }`}
              onClick={() => handleTaskSelect(task)}
            >
              {task.name}
            </button>
          ))}
        </div>
        {/* dalis kur viskas surasyta apie habita paspaudus ant jo */}

        {selectedTask && (
          <div
            className={`border p-4  ${
              selectedTask.isCompleted ? "bg-green-300" : ""
            }`}
          >
            <div className="flex justify-end items-center space-x-2">
              <button onClick={handleShowNotes}>
                <FontAwesomeIcon
                  icon={faNoteSticky}
                  className="block text-grey-500 text-blue-600"
                />
              </button>
              <img
                onClick={handlePomedorClick}
                src={pomidoras}
                title="pomidoras"
                width={"16px"}
                alt=""
              />
            </div>
            <h2 className="font-bold text-lg ">
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Enter task name"
                  className="border rounded px-2 py-1 mb-2 w-full"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
              ) : (
                selectedTask.name
              )}
            </h2>
            {isEditing && (
              <>
                <div className="flex mb-2">
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border border-gray-400 rounded py-2 px-4 w-full"
                  />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border border-gray-400 rounded py-2 px-4 w-full"
                  />
                </div>
                <div className="flex mb-2">
                  <div>priority</div>
                  <select
                    value={priority}
                    placeholder=""
                    onChange={(e) => {
                      setPriority(e.target.value);
                    }}
                    className="border border-gray-400 rounded py-2 px-4 w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

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
              </>
            )}
            {!isEditing && (
              <p className="text-gray-600">
                Description: {selectedTask.description}
              </p>
            )}
            {!isEditing && (
              <p
                className={`text-gray-600 ${getPriorityColor(
                  selectedTask.priority
                )}`}
              >
                Priority: {selectedTask.priority}
              </p>
            )}
            {!isEditing && (
              <p className="text-gray-600">Category: {selectedTask.category}</p>
            )}
            {!isEditing && (
              <p className="text-gray-600">FromDate: {selectedTask.fromDate}</p>
            )}
            {!isEditing && (
              <p className="text-gray-600">ToDate: {selectedTask.toDate}</p>
            )}

            <div className="flex justify-end mt-4">
              {isEditing ? (
                <>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded mr-2"
                    onClick={handleEdit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
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
                    onClick={() => handleDelete(selectedTask.id)}
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleCompleted}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs"
                  >
                    {selectedTask && selectedTask.isCompleted
                      ? "Completed ✓"
                      : "Completed"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showPomedor && (
        <div className="fixed top-40 left-0 right-0 flex justify-center items-center">
          <div className="w-full max-w-md">
            <div className="relative border border-green-500 bg-green-100 opacity-100">
              <div className="h-full border border-black">
                <div className="text-xs">
                  <PomodoroTimer setShowPomedor={setShowPomedor} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTracker;
