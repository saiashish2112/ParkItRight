// src/components/NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/parkitright.png" alt="Logo" className="h-10 mr-3" />
        <span className="text-xl font-bold">ParkItRight</span>
      </div>
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-gray-400">
            Contact
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-gray-400">
            About Us
          </Link>
        </li>
        <li>
          <Link to="/register" className="hover:text-gray-400">
            Register
          </Link>
        </li>
        <li>
          <Link to="/login" className="hover:text-gray-400">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
