import React from "react";
import NavBar from "../navbar/NavBar";
import "./Home.css";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <NavBar />
      </div>
      <footer className="bg-gray-800 text-gray-200 p-4 rounded-lg mt-auto w-full text-center">
        <p>© 2024 ParkItRight Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
