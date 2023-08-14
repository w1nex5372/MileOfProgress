import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/mainPage";
import Habits from "./pages/habits";
import RegistrationPage from "./pages/registrationPage.jsx";
import LoginForm from "./pages/logInPage";
import GoalTracker from "./pages/goalsPage";
import TimeManangement from "./pages/timeManagementPage";
import { AuthProvider } from "./pages/authContext";
import { BadgeProvider } from "./components/badgeContext";
import { HabitProvider } from "./components/habitContext";
import ForgotPasswordForm from "./pages/ForgotPasswordForm ";
import ResetPasswordForm from "./pages/resetPassword";

function App() {
  return (
    <AuthProvider>
      <HabitProvider>
        <BadgeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/Habits" element={<Habits />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/LoginForm" element={<LoginForm />} />
              <Route path="/GoalTracker" element={<GoalTracker />} />
              <Route path="/TimeManangement" element={<TimeManangement />} />
            </Routes>
          </BrowserRouter>
        </BadgeProvider>
      </HabitProvider>
    </AuthProvider>
  );
}

export default App;
