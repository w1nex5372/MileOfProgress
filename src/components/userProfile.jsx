import React, { useEffect, useState } from "react";
import userImage from "../img/user.jpg";
import { AuthContext } from "../pages/authContext";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { setAuthHeaders } from "../api/setAuthHeaders";
import { useNavigate } from "react-router-dom";
import { useBadgeContext } from "./badgeContext";
import archery from "../img/badges/archery.png";
import award from "../img/badges/award.png";
import { useHabitContext } from "./habitContext";
const UserProfile = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState("");
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate("");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState(userImage);
  const [selectedBadgeImage, setSelectedBadgeImage] = useState(userImage);
  const { habits, clearHabits } = useHabitContext();

  const { earnedBadges } = useBadgeContext(); // Use the earnedBadges context

  const handleAvatarChange = (badgeImagePath) => {
    setProfileAvatar(badgeImagePath);
    setShowAvatarMenu(false); // Hide the avatar change menu after selecting a badge
    // Save the selected badge image path to local storage
    localStorage.setItem("selectedBadgeImage", badgeImagePath);
    setSelectedBadgeImage(badgeImagePath);
  };

  useEffect(() => {
    const selectedBadgeImagePath = localStorage.getItem("selectedBadgeImage");
    if (selectedBadgeImagePath) {
      setProfileAvatar(selectedBadgeImagePath);
    } else {
      // If no selected badge image found in local storage, use the default userImage
      setProfileAvatar(userImage);
    }
  }, []);

  const handleSignOutClick = () => {
    handleLogout();
    setShowMenu(false);
    localStorage.removeItem("token");
    navigate("/");
    clearHabits();
  };

  const handleToolClick = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        // Set authorization headers using the API token
        setAuthHeaders(localStorage.getItem("token"));

        const response = await axios.get("http://localhost:3200/api/username");
        const { username } = response.data;
        setUsername(username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  return (
    <div className="text-white relative flex justify-center align-center text-center border rounded-lg p-3 border-white-400 border-opacity-50 shadow-md">
      <img src={profileAvatar} alt="User Profile" className="w-6 inline" />
      <div className="ml-2">{username ? username : "Loading..."}</div>
      <FontAwesomeIcon
        icon={faGear}
        onClick={handleToolClick}
        className="ml-2 pt-1 cursor-pointer"
      />

      {showMenu && (
        <div className="absolute top-10 mt-1 right-0 z-50 bg-white text-gray-800 rounded shadow-lg text-bold font-bold">
          <ul className="flex flex-col text-xs">
            <li className="py-1 px-2 hover:bg-gray-200 border-b border-gray-200 cursor-pointer">
              <span className="block">Stats</span>
            </li>
            <li
              className="py-1 px-2 hover:bg-gray-200 border-b border-gray-200 cursor-pointer"
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            >
              <span className="block">Change avatar</span>
            </li>
            <li className="py-1 px-2 hover:bg-gray-200 border-b border-gray-200 cursor-pointer">
              <span className="block">Upgrade</span>
            </li>
            <li className="py-1 px-2 hover:bg-gray-200 border-b border-gray-200 cursor-pointer">
              <span className="block">Help</span>
            </li>
            <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
              <span className="block" onClick={handleSignOutClick}>
                Sign out
              </span>
            </li>
          </ul>
        </div>
      )}
      {/* Show the avatar change menu when the "Change avatar" option is clicked */}
      {showAvatarMenu && (
        <div className="absolute top-10 mt-1 right-0 z-50 bg-white text-gray-800 rounded shadow-lg text-bold font-bold">
          <ul className="flex flex-col text-xs">
            {earnedBadges
              .filter((badge) => badge.is_shown === 1) // Filter badges with is_shown: 1
              .map((badge) => (
                <li
                  key={badge.badge_id}
                  className="py-1 px-2 hover:bg-gray-200 border-b border-gray-200 cursor-pointer"
                  onClick={() => handleAvatarChange(badge.badge_image_path)}
                >
                  <img
                    src={badge.badge_image_path}
                    alt={badge.badge_name}
                    className="w-6 inline cursor-pointer"
                  />
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
