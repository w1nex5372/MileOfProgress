import React, { useEffect, useState } from "react";
import face from "../img/aa.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/authContext";
import { useContext } from "react";
import { useBadgeContext } from "../components/badgeContext";
import archery from "../img/badges/archery.png";
import jwt_decode from "jwt-decode";
import award from "../img/badges/award.png";
import champion from "../img/badges/champion-belt.png";
import dartboard from "../img/badges/dartboard.png";
import space from "../img/badges/space-suit.png";

const LoginForm = () => {
  const { handleLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginFailed, setLoginFailed] = useState(false);

  // Use the useBadgeContext hook to access and set earnedBadges array
  const { earnedBadges, setEarnedBadges } = useBadgeContext();

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleBadgeAssignment = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost:3200/api/setUserBadges",
        {
          userId,
          badges: [
            {
              name: "Badge 0",
              imagePath: dartboard,
              message: "Well done!",
              threshold: 2,
            },
            {
              name: "Badge 1",
              imagePath: archery,
              message: "Congratulations!",
              threshold: 5,
            },
            {
              name: "Badge 2",
              imagePath: award,
              message: "Well done!",
              threshold: 10,
            },
            {
              name: "Badge 3",
              imagePath: champion,
              message: "Congratulations!",
              threshold: 12,
            },
            {
              name: "Badge 4",
              imagePath: space,
              message: "Congratulations!",
              threshold: 15,
            },
            // Add more badges as needed
          ],
        }
      );

      console.log("Badges assigned successfully:", response.data);
      fetchBadges(userId); // Wait for the badges to be fetched
    } catch (error) {
      console.error("Error assigning badges:", error);
      throw error;
    }
  };

  const fetchBadges = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3200/api/getBadges/${userId}`
      );

      // Update the state with the fetched badges
      setEarnedBadges(response.data);
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3200/api/login", {
        email,
        password,
      });

      const token = response.data.token;
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

      localStorage.setItem("token", token);

      handleLogin();
      handleBadgeAssignment(userId);

      navigate("/");

      // Call fetchBadges only after the user has successfully logged in
      await fetchBadges(userId);

      console.log("Fetched badges:", earnedBadges);
    } catch (error) {
      console.log("Login failed.");
      setLoginFailed(true);
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchInitialBadges = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwt_decode(token);
          const userId = decodedToken.userId;

          // Fetch badges only if the user is logged in (i.e., token exists)
          await fetchBadges(userId);

          console.log("Fetched badges:", earnedBadges);
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    fetchInitialBadges();
  }, []);

  return (
    <>
      <div className="text-center min-w-full font-semibold tracking-tight text-green-500 text-3xl max-h-min bg-gray-800 p-3">
        <Link to="/">Milestone Mentor</Link>
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center ">
        <div className="bg-black p-8 rounded shadow-lg opacity-90">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">
            Welcome!
          </h2>
          {loginFailed && (
            <div className=" text-red-500 font-bold p-2">
              Wrong Password or Email
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-between">
              <div>
                <a
                  href="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
