import React, { useState, useEffect } from "react";
import axios from "axios";

const Calendar = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [color, setColor] = useState(null);
  const [showColorButtons, setShowColorButtons] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const handleDateClick = (date) => {
    const clickedDate = new Date(date);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to the start of the day

    if (clickedDate > currentDate) {
      // Return early if the clicked date is after the current date
      return;
    }

    setSelectedDate(date);
    setShowColorButtons(true);
  };

  const handleColorSelect = async (selectedColor) => {
    setColor(selectedColor);
    setShowColorButtons(false);

    // Convert the date to the desired format (YYYY-MM-DD)
    const formattedDate = new Date(selectedDate).toLocaleDateString("en-CA");

    // Determine the id based on whether it's a habit or goal
    const id = props.habitId || props.goalId;

    // Determine the property name based on whether it's a habit or goal
    const idPropertyName = props.habitId ? "habitId" : "goalId";

    // Send the data to the server
    try {
      await axios.post("http://localhost:3200/api/calendarDays", {
        userId: props.userId,
        [idPropertyName]: id,
        date: formattedDate,
        background_color: selectedColor,
      });

      // Update the markedDates state with the new data
      setMarkedDates((prevMarkedDates) => ({
        ...prevMarkedDates,
        [formattedDate]: selectedColor,
      }));

      // Fetch the updated data from the server
      const response = await axios.get(
        `http://localhost:3200/api/getCalendarDays?${idPropertyName}=${id}`
      );

      const fetchedCalendarDays = response.data.calendarDays;
      const newMarkedDates = {};

      fetchedCalendarDays.forEach((day) => {
        const date = new Date(day.date);
        date.setDate(date.getDate() + 1);
        const formattedDate = date.toISOString().split("T")[0];
        newMarkedDates[formattedDate] = day.background_color;
      });

      // Update the markedDates state with the new fetched data
      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + 1);
      return newMonth;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = props.habitId || props.goalId;
        const idPropertyName = props.habitId ? "habitId" : "goalId";

        if (!id) {
          return; // No habitId or goalId provided
        }

        const response = await axios.get(
          `http://localhost:3200/api/getCalendarDays?${idPropertyName}=${id}`
        );

        const fetchedCalendarDays = response.data.calendarDays;
        const markedDates = {};

        fetchedCalendarDays.forEach((day) => {
          const date = new Date(day.date);
          date.setDate(date.getDate() + 1);
          const formattedDate = date.toISOString().split("T")[0];
          markedDates[formattedDate] = day.background_color;
        });

        setMarkedDates(markedDates);

        // Process markedDates to generate chart data and options
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props.habitId, props.goalId]);

  useEffect(() => {
    setCurrentYear(currentMonth.getFullYear());
  }, [currentMonth]);

  const getCurrentMonth = () => {
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
    return months[currentMonth.getMonth()];
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth();
    const calendarDays = [];

    for (let i = 1; i <= daysInMonth; i++) {
      let date = new Date(currentYear, currentMonth.getMonth(), i);
      const currentDate = new Date();

      const formattedDate = date.toLocaleDateString("en-CA");
      const isSelected = selectedDate === formattedDate;
      const isCurrentDay =
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear();
      const isDisabled = date > currentDate; // Check if the date is after the current date

      const backgroundColor =
        isSelected || markedDates[formattedDate]
          ? markedDates[formattedDate] || "bg-gray-200 font-bold"
          : isCurrentDay
          ? "bg-blue-200 font-bold"
          : "";

      const handleClick = () => {
        if (!isDisabled) {
          handleDateClick(formattedDate);
        }
      };

      calendarDays.push(
        <div
          key={i}
          className={`calendar-day ${backgroundColor} border border-gray-300 flex justify-center items-center p-1 font-bold rounded ${
            isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleClick}
        >
          {i}
        </div>
      );
    }

    return calendarDays;
  };

  const handleClose = () => {
    props.setShowCalendar(false);
  };

  return (
    <div className="relative border-black border p-3 bg-white ">
      <div className="flex justify-between items-center mb-4 border border-b">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          type="button"
          onClick={handlePrevMonth}
        >
          Prev
        </button>
        <div className="text-xl">
          {getCurrentMonth()} {currentYear}
        </div>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          type="button"
          onClick={handleNextMonth}
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4 ">{renderCalendar()}</div>
      {showColorButtons && (
        <div className="flex mt-4 justify-center">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded mr-2"
            onClick={() => handleColorSelect("bg-red-500")}
          >
            X
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => handleColorSelect("bg-green-500")}
          >
            ✓
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
            onClick={() => handleColorSelect("")}
          >
            undo
          </button>
        </div>
      )}
      <button
        className="px-4 py-2 bg-gray-200 rounded mt-4"
        type="button"
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  );
};

export default Calendar;
