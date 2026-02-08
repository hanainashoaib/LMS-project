import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all your pages correctly
import Signup from './pages/Signup';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard'; // THIS IS LIKELY THE MISSING LINE
import StudentList from './pages/StudentList';
import StudentDashboard from './pages/StudentDashboard';

import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;