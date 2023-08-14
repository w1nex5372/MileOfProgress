import React from "react";
import timeManagement from "../img/timeManagement.jpg";
import goals from "../img/goals.jpg";
import productivity from "../img/productivyto.jpg";

const Blog = () => {
  return (
    <div className="container mx-auto pb-4">
      <h2 className="text-3xl font-bold text-green-500 mb-4 text-center p-1">
        Blog
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            className="h-32 sm:h-48 w-full object-cover rounded-t-lg"
            src={timeManagement}
            alt="5 Tips for Effective Time Management"
          />
          <div className="p-4 sm:p-6 bg-black text-white">
            <h3 className="font-bold text-xl sm:text-2xl text-green-500 py-2 mb-2">
              Effective Time Management
            </h3>
            <p className="text-sm sm:text-base">{/* Your content here */}</p>
            <a
              className="mt-3 sm:mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              href="https://www.michaelpage.com/advice/career-advice/growing-your-career/5-tips-better-your-time-management"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            className="h-32 sm:h-48 w-full object-cover rounded-t-lg"
            src={goals}
            alt="How to Set Achievable Goals"
          />
          <div className="p-4 sm:p-6 bg-black text-white">
            <h3 className="font-bold text-xl sm:text-2xl text-green-500 py-2 mb-2">
              How to Set Achievable Goals
            </h3>
            <p className="text-sm sm:text-base">{/* Your content here */}</p>
            <a
              className="mt-3 sm:mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              href="https://www.betterup.com/blog/how-to-set-goals-and-achieve-them"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More
            </a>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            className="h-32 sm:h-48 w-full object-cover rounded-t-lg"
            src={productivity}
            alt="Improve your productivity"
          />
          <div className="p-4 sm:p-6 bg-black text-white">
            <h3 className="font-bold text-xl sm:text-2xl text-green-500 py-2 mb-2">
              Improve your productivity
            </h3>
            <p className="text-sm sm:text-base">{/* Your content here */}</p>
            <a
              className="mt-3 sm:mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              href="https://www.atlassian.com/blog/productivity/simple-ways-to-be-productive-at-work"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
