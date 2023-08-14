import React, { useState, useRef, useEffect } from "react";

const TimeTracker = ({ taskId }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleStartTracking = () => {
    clearInterval(intervalRef.current);
    setElapsedTime(0);

    intervalRef.current = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);
  };

  const handleStopTracking = () => {
    clearInterval(intervalRef.current);
    // Save the elapsed time to the task or perform any necessary actions
  };

  return (
    <div className="border border-black fixed right-0 bottom-0">
      <div className="flex justify-between mb-4">
        <button
          onClick={handleStartTracking}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start
        </button>
        <button
          onClick={handleStopTracking}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Stop
        </button>
      </div>
      <div className="text-lg">Time: {formatTime(elapsedTime)}</div>
    </div>
  );
};

export default TimeTracker;
