import React from "react";
import chartai from "../img/features/imgChart.png";
import timer from "../img/features/timer.png";
import habitAssociated from "../img/features/habitAssociation.png";

const Testimonials = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-4xl font-bold mb-2 text-green-500 text-center">
        Features
      </h2>

      <div className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/2 pr-4 text-center mb-4 md:mb-0">
          <img
            src={chartai}
            alt="ChartAI"
            className="w-full h-auto md:w-48 lg:w-64 xl:w-80 mx-auto"
          />
        </div>
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold mb-2 text-center text-green-500">
            Visual Insights
          </h3>
          <p className="text-gray-600 p-3">
            Gain a deeper understanding of your habits with Visual Insights.
            Track your completion streaks, days of accomplishment, and habit
            scores through informative charts and graphs. Visualize your
            progress and stay motivated on your journey.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/2 pr-4 text-center mb-4 md:mb-0">
          <img
            src={timer}
            alt="Pomodoro Timer"
            className="w-full h-auto md:w-48 lg:w-64 xl:w-80 md:mx-auto pl-3"
          />
        </div>
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold mb-2 text-center text-green-500">
            Pomodoro Timer
          </h3>
          <p className="text-gray-600 p-3">
            Enhance your productivity with our built-in Pomodoro Timer. Set
            custom work and break intervals to maintain focus and manage your
            time efficiently. Stay in control of your tasks and achieve more in
            less time.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 pr-4 text-center mb-4 md:mb-0">
          <img
            src={habitAssociated}
            alt="Habit Association"
            className="w-full h-auto md:w-48 lg:w-64 xl:w-80 md:mx-auto"
          />
        </div>
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold mb-2 text-center text-green-500">
            Habit Association
          </h3>
          <p className="text-gray-600 p-3">
            Associate your habits with your goals and monitor your progress
            effectively. Track how your habits contribute to achieving your
            goals and stay motivated to stay on track. Visualize your habit-goal
            connections and make your journey to success even more rewarding.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
