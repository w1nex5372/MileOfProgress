import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegistrationCompleted = () => {
  const navigate = useNavigate();

  const handleLogIn = () => {
    navigate("/LoginForm");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
      <div className="text-center bg-white border-2 border-gray-300 shadow-lg rounded-lg p-6 w-3/5">
        <p className="mb-4">
          Registration Complete, well done! Now you can log in
        </p>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogIn}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default RegistrationCompleted;
