import { useState, useEffect } from "react";
import {
  FaProductHunt,
  FaBullseye,
  FaClock,
  FaBars,
  FaCheckSquare,
} from "react-icons/fa";
import UserProfile from "./userProfile";
import { Link } from "react-router-dom";
import { AuthContext } from "../pages/authContext";
import { useContext } from "react";
import Cookies from "js-cookie";
function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isLoggedIn, handleLogout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link
          to="/"
          className="font-semibold tracking-tight text-green-500 text-3xl"
        >
          Mile Of Progress
        </Link>
      </div>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <FaBars />
        </button>
      </div>
      <div
        className={`${
          isNavOpen ? "block" : "hidden"
        } w-full block flex-grow lg:flex lg:items-center lg:w-auto  text-center`}
      >
        <div className="text-sm lg:flex-grow">
          <Link
            to="/Habits"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            activeClassName="text-white"
          >
            <FaCheckSquare className="inline-block mr-1 mb-1" />
            Habits
          </Link>

          <Link
            to="/GoalTracker"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            activeClassName="text-white"
          >
            <FaBullseye className="inline-block mr-1 mb-1" />
            Goals
          </Link>
          <Link
            to="/TimeManangement"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
            activeClassName="text-white"
          >
            <FaClock className="inline-block mr-1 mb-1" /> Time Management
          </Link>
        </div>

        <div className="flex items-center p-4 justify-center">
          {isLoggedIn ? (
            <UserProfile />
          ) : (
            <>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4">
                <Link to="/LoginForm">Log In</Link>
              </button>

              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                <Link to="/register">Register Now!</Link>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
