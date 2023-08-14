import React, { useState, useEffect } from "react";
import tune from "../sound/tune.mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const PomodoroTimer = (props) => {
  const [time, setTime] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [isWorkInterval, setIsWorkInterval] = useState(true);
  const [workTime, setWorkTime] = useState(25); // Default work time is 25 minutes
  const [breakTime, setBreakTime] = useState(5); // Default break time is 5 minutes
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [longestSession, setLongestSession] = useState(0);

  const handleCloseTimer = () => {
    props.setShowPomedor(false);
  };

  const updateTotalTimeSpent = async (type, timeSpent) => {
    try {
      const response = await axios.post(
        `http://localhost:3200/api/updateTotalTimeSpent`,
        { type, timeSpent }
      );

      if (response.data.success) {
        console.log("Total time spent has been updated.");
      } else {
        console.error("Error updating time:", response.data.error);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  useEffect(() => {
    let requestId;

    if (isRunning) {
      const startTime = Date.now();

      const updateTimer = () => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setTime(time - elapsedSeconds);

        if (time <= 0) {
          // Switch between work and break intervals
          setIsWorkInterval((prevIsWorkInterval) => !prevIsWorkInterval);
          setIsRunning(false);
          setCycleCount((prevCycleCount) => prevCycleCount + 1);

          // Update the total time spent
          const sessionDuration = isWorkInterval
            ? workTime * 60
            : breakTime * 60;
          setTotalTimeSpent(
            (prevTotalTimeSpent) => prevTotalTimeSpent + sessionDuration
          );

          // Update longest session if needed
          if (sessionDuration > longestSession) {
            setLongestSession(sessionDuration);
            updateTotalTimeSpent("longest", sessionDuration); // Update longest session in the database
          }

          // Play a sound when the session ends
          playSound();

          // Show a notification when the session ends
          showNotification("Session completed!");

          // ... (other code)
        } else {
          requestId = requestAnimationFrame(updateTimer);
        }
      };

      requestId = requestAnimationFrame(updateTimer);
    }

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [isRunning, time, isWorkInterval, workTime, breakTime]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsWorkInterval(true);
    setTime(workTime * 60); // Reset to the work time
    setIsRunning(false);
  };

  const formatTime = (timeInSeconds) => {
    const weeks = Math.floor(timeInSeconds / (3600 * 24 * 7));
    const days = Math.floor((timeInSeconds % (3600 * 24 * 7)) / (3600 * 24));
    const hours = Math.floor((timeInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    if (weeks > 0) {
      return `${weeks}w ${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const showNotification = (message) => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        // If permission is already granted, show the notification
        new Notification(message);
      } else if (Notification.permission !== "denied") {
        // If permission is not denied, request permission from the user
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            // If permission is granted, show the notification
            new Notification(message);
          }
        });
      } else {
        console.log("Notification permission denied.");
      }
    } else {
      console.log("Notifications not supported.");
    }
  };

  const playSound = () => {
    const audio = new Audio(tune); // Replace with the path to your sound file

    // Play the sound
    audio.play();
  };

  const timerClassName = isWorkInterval ? "work-interval" : "break-interval";

  return (
    <div className="container mx-auto px-4">
      <button
        onClick={handleCloseTimer}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h1 className="text-xl text-center font-bold mt-4 mb-6 text-green-500 pb-4">
        Pomodoro Timer
      </h1>
      <div className="flex justify-center items-center md:h-48">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">
            {isWorkInterval ? "Work Interval" : "Break Interval"}
          </p>
          <p className="text-3xl font-bold mb-4">{formatTime(time)}</p>
          <p className="text-lg mb-4">Completed Cycles: {cycleCount}</p>
          <p className="mb-4 md:hidden">
            Total Time Spent: {formatTime(totalTimeSpent)}
          </p>
          <div className="flex flex-col md:flex-row md:justify-center">
            {isRunning ? (
              <button
                onClick={pauseTimer}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 md:mr-2"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={startTimer}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 md:mr-2"
              >
                Start
              </button>
            )}
            <button
              onClick={resetTimer}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Reset
            </button>
          </div>
          <div className="flex border flex-col md:flex-row md:items-center mb-4 md:mb-10">
            <div className="md:w-1/2 flex items-center mb-2 md:mb-0 md:mr-2">
              <label className="mr-2 font-bold">Work Time (minutes):</label>
              <input
                type="number"
                min="1"
                value={workTime}
                onChange={(e) => setWorkTime(parseInt(e.target.value))}
                className="w-20 md:w-auto"
              />
            </div>
            <div className="md:w-1/2 flex items-center">
              <label className="mr-2 font-bold">Break Time (minutes):</label>
              <input
                type="number"
                min="1"
                value={breakTime}
                onChange={(e) => setBreakTime(parseInt(e.target.value))}
                className="w-20 md:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
      <p className="text-center md:hidden">
        Total Time Spent: {formatTime(totalTimeSpent)}
      </p>
    </div>
  );
};

export default PomodoroTimer;
