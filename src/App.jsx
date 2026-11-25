
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Header from "./Header";
import Home from "./Home";

import AdminLanding from "./admin/AdminLanding.jsx";
import FacultyLanding from "./faculty/FacultyLanding.jsx";
import StudentLanding from "./student/StudentLanding.jsx";

import AllUser from "./admin/AllUser.jsx";
import AllFaculty from "./admin/AllFaculty.jsx";

import CreateEvent from "./admin/CreateEvent.jsx";
import AllEvent from "./admin/AdminAllEvent.jsx";
import RegisteredStudents from "./admin/RegisteredStudents.jsx";
import AdminAllEvent from "./admin/AdminAllEvent.jsx";

import MyRegistered from "./student/myRegisteredEvents.jsx";

import CreateClub from "./student/CreateClub.jsx";
import AllClub from "./student/AllClub";
import ViewClub from "./student/ViewClub.jsx";
import AdminAllClub from "./admin/AdminAllClub.jsx";

import FacultyCreateClub from "./faculty/FacultyCreateClub.jsx";
import FacultyAllEvent from "./faculty/FacultyAllEvent.jsx";
import FacultyAllClub from "./faculty/FacultyAllClubs.jsx";

import ClubChat from "./student/StudentClubChat.jsx";

import AdminProfile from "./admin/AdminProfile.jsx";
import FacultyProfile from "./faculty/FacultyProfile.jsx";
import StudentProfile from "./student/StudentProfile.jsx";

import AllPosts from "./student/AllPosts";

import "./App.css";

function App() {

  const [IsLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userid")
  );

  const [role, setRole] = useState(
    localStorage.getItem("role") || ""
  );

  return (
    <BrowserRouter>

      <Header
        IsLoggedIn={IsLoggedIn}
        role={role}
        handleLogin={setIsLoggedIn}
        handleRole={setRole}
      />

      <Routes>

        {/* PUBLIC HOME PAGE */}
        <Route path="/" element={<Home />} />

        {/* LOGIN AND REGISTER */}
        <Route
          path="/login"
          element={
            <Login
              handleIsloggedin={setIsLoggedIn}
              handleRole={setRole}
            />
          }
        />

        <Route path="/register" element={<Register />} />

        {/* DASHBOARDS */}
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/faculty" element={<FacultyLanding />} />
        <Route path="/student" element={<StudentLanding />} />

        {/* ADMIN */}
        <Route path="/allStudent" element={<AllUser />} />
        <Route path="/allFaculty" element={<AllFaculty />} />
        <Route path="/createEvent" element={<CreateEvent />} />
        <Route path="/allEvent" element={<AllEvent />} />
        <Route
          path="/registeredStudents/:eventId"
          element={<RegisteredStudents />}
        />
        <Route path="/adminAllEvent" element={<AdminAllEvent />} />
        <Route path="/adminAllClub" element={<AdminAllClub />} />
        <Route path="/adminprofile" element={<AdminProfile />} />

        {/* STUDENT */}
        <Route path="/createClub" element={<CreateClub />} />
        <Route path="/allClub" element={<AllClub />} />
        <Route path="/viewClub/:id" element={<ViewClub />} />
        <Route
          path="/myRegisteredEvents"
          element={<MyRegistered />}
        />
        <Route path="/clubChat" element={<ClubChat />} />
        <Route path="/clubChat/:clubId" element={<ClubChat />} />
        <Route path="/studentprofile" element={<StudentProfile />} />
        <Route path="/allPosts" element={<AllPosts />} />

        {/* FACULTY */}
        <Route
          path="/facultyCreateClub"
          element={<FacultyCreateClub />}
        />
        <Route
          path="/facultyAllEvent"
          element={<FacultyAllEvent />}
        />
        <Route
          path="/facultyAllClub"
          element={<FacultyAllClub />}
        />
        <Route path="/facultyprofile" element={<FacultyProfile />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
