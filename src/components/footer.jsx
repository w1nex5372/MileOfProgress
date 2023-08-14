import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 font-medium text-center md:text-left mb-4 md:mb-0">
            © 2023 Milestone Mentor. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center space-x-4">
            <a
              className="text-gray-400 hover:text-gray-100 transition duration-300"
              href="/terms-of-service"
            >
              Terms of Service
            </a>
            <a
              className="text-gray-400 hover:text-gray-100 transition duration-300"
              href="/privacy-policy"
            >
              Privacy Policy
            </a>
            <a
              className="text-gray-400 hover:text-gray-100 transition duration-300"
              href="/contact-us"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
