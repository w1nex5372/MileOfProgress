import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header";
import RegistrationCompleted from "./regCompleted";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [interests, setInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [capitalPassword, setCapitalPassword] = useState(false);
  const [passwordLengthShort, setPasswordLengthShort] = useState(false);
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameTaken(false); // Reset the usernameTaken state when the username changes
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailTaken(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setCapitalPassword(false);
    setPasswordLengthShort(false);
    setPasswordsDontMatch(false);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmedPassword(e.target.value);
  };

  const handleInterestChange = (e) => {
    const selectedInterests = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setInterests(selectedInterests);
  };

  const handleCustomInterestChange = (e) => {
    setCustomInterest(e.target.value);
  };

  const handleAddCustomInterest = (e) => {
    e.preventDefault();
    if (customInterest.trim() !== "") {
      setInterests([...interests, customInterest]);
      setCustomInterest("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordLengthShort(true);
      return;
    }
    if (!/^[A-Z]/.test(password)) {
      setCapitalPassword(true);
      return;
    }

    if (password !== confirmedPassword) {
      setPasswordsDontMatch(true);
      return;
    }

    axios
      .get(`http://localhost:3200/api/checkUsername/${username}`)
      .then((response) => {
        if (response.data.exists) {
          setUsernameTaken(true); // Set the usernameTaken state if the username exists
          console.log("username is already taken");
        } else {
          // Proceed with registration if the username is available
          axios
            .post("http://localhost:3200/api/data", {
              username,
              email,
              password,
              interests,
            })
            .then((response) => {
              console.log(response);
              setAccountCreated(true);
              setUsername(""); // Reset form fields except username
              setEmail("");
              setPassword("");
              setConfirmedPassword("");
              setInterests([]);
              setCustomInterest("");
              emailTaken(false);
              usernameTaken(false);
              localStorage.setItem("token", response.data.token);
            })
            .catch((error) => {
              console.error("Error registering user:", error);
              if (
                error.response.data.error ===
                "Email is already taken. Please choose another email."
              ) {
                setEmailTaken(true);
              }
            });
        }
      })
      .catch((error) => {
        console.error("Error checking username:", error);
      });
  };
  return (
    <>
      <Header></Header>
      <div className="bg-cover bg-center  text-xs">
        <div className="">{accountCreated && <RegistrationCompleted />}</div>
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 pt-3 text-green-500 text-center">
            Registration Form
          </h2>
          {usernameTaken && (
            <div className="  p-3 text-center text-red-500 font-bold text-xs tracking-wide">
              Username is taken, choose different one
            </div>
          )}
          {emailTaken && (
            <div className="  p-3 text-center text-red-500 font-bold text-xs tracking-wide">
              Email is taken, choose different one
            </div>
          )}
          {capitalPassword && (
            <div className="  p-3 text-center text-red-500 font-bold text-xs tracking-wide">
              Password must start with a capital
            </div>
          )}
          {passwordLengthShort && (
            <div className="  p-3 text-center text-red-500 font-bold text-xs tracking-wide">
              password must be longer then 6"
            </div>
          )}
          {passwordsDontMatch && (
            <div className="  p-3 text-center text-red-500 font-bold text-xs tracking-wide">
              passwords dont match
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className={
                  usernameTaken
                    ? "w-full px-4 py-2 border rounded border-red-600 focus:outline-none focus:ring-2 "
                    : "w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className={
                  emailTaken
                    ? "w-full px-4 py-2 border rounded border-red-600 focus:outline-none focus:ring-2 "
                    : "w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={
                  capitalPassword || passwordLengthShort || passwordsDontMatch
                    ? "w-full px-4 py-2 border rounded border-red-600 focus:outline-none focus:ring-2 "
                    : "w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                required
              />

              <label
                htmlFor="confirmPassword"
                className="block mb-2 font-medium"
              >
                Cofirm Password
              </label>
              <input
                type="password"
                id="password"
                value={confirmedPassword}
                onChange={handleConfirmPasswordChange}
                className={
                  passwordsDontMatch
                    ? "w-full px-4 py-2 border rounded border-red-600 focus:outline-none focus:ring-2 "
                    : "w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                }
                required
              />
              <div className="mb-6">
                <label htmlFor="interests" className="block mb-2 font-medium">
                  Interests (select multiple)
                </label>
                <select
                  id="interests"
                  value={interests}
                  onChange={handleInterestChange}
                  multiple
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sports">Sports</option>
                  <option value="music">Music</option>
                  <option value="reading">Reading</option>
                  <option value="cooking">Cooking</option>
                  {/* Add more interests */}
                </select>
              </div>
            </div>
            <div class="mb-4 ">
              <label for="customInterest" class="block mb-2 font-medium">
                Custom Interest
              </label>
              <input
                type="text"
                id="customInterest"
                value={customInterest}
                onChange={handleCustomInterestChange}
                class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                class=" bg-blue-500 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4 mt-2"
              >
                Add
              </button>
            </div>
            <div className="flex justify-center ">
              <button
                type="submit"
                className="bg-blue-500  hover:bg-blue-600 focus:outline-none focus:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
