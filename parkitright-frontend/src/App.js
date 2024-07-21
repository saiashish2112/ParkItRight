import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParkingSpotsComponent from "./components/ParkingSpots/ParkingSpotsComponent";
import Home from "./components/home/Home";
import AssignSpot from "./components/spot/AssignSpot";
import ReleaseSpot from "./components/spot/ReleaseSpot";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import GetProfile from "./components/profile/GetProfile";
import UpdateProfile from "./components/profile/UpdateProfile";
import Contact from "./components/contact/Contact";
import AboutUs from "./components/aboutus/AboutUs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assign-spot" element={<AssignSpot />} />\
        <Route path="/release-spot" element={<ReleaseSpot />} />
        <Route path="/spots" element={<ParkingSpotsComponent />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/get-profile" element={<GetProfile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
