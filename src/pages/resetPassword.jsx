import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";
import LoginForm from "./logInPage";
import { useNavigate } from "react-router-dom"; // Import navigate

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get("token");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      console.log("Sending reset password request with token:", resetToken);

      const response = await axios.post(
        "http://localhost:3200/api/newPassword",
        { newPassword: password },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );

      if (response.data.success) {
        setResetSuccess(true);
      }
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  return (
    <div>
      <Header />

      <form onSubmit={handleResetPassword} className="mt-8 px-6">
        {resetSuccess ? (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-center">
              Your password has been reset successfully.
            </p>
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={() => {
                navigate("/LoginForm");
              }}
            >
              Log in
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-500 text-center">
              Enter your new password and confirm it below.
            </p>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-medium">
                New Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your new password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Reset Password
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPasswordForm;
