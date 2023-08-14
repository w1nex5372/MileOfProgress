import React from "react";
import Header from "../components/header";
import MainSection from "../components/goals";
import Testimonials from "../components/testimonials";
import Blog from "../components/blog";
import Footer from "../components/footer";
import aa from "../img/aa.jpg";
const MainPage = () => {
  return (
    <>
      <Header />

      <MainSection />
      <Testimonials />
      <Blog />
      <Footer />
    </>
  );
};

export default MainPage;
