import { useState } from "react";
import axios from "axios";
import Header from "../components/header";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending reset request with email:", email); // Add this line
      const response = await axios.post(
        "http://localhost:3200/api/resetPasswordRequest",
        { email }
      );

      if (response.data.success) {
        setRequestSent(true);
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
    }
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleResetRequest} className="mt-8 px-6">
        {requestSent ? (
          <p className="mb-4 text-center">
            Check your email for instructions to reset your password.
          </p>
        ) : (
          <>
            <p className="mb-4 text-gray-500 text-center">
              Trouble with logging in? Enter your email address or username,
              we'll send you a link to get back into your account.
            </p>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
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

export default ForgotPasswordForm;
