import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './admin/Dashboard';
import Students from './admin/Students';
import Trainer from './admin/Trainer';
import GradePrice from './admin/gradePrice';
import AdminStudentView from './admin/AdminStudentView';
import Tstudent from './admin/Tstudent';
import AdminLogin from './form/AdminLogin';
import AdminTrainerStudentGrade from './admin/adminTrainerStudentGrade';
import { useState } from 'react';


function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleAdminLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AdminLogin onLogin={handleAdminLogin} />} />
          {isLoggedIn ? (
            <Route element={<Sidebar onLogout={handleLogout} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/student" element={<Students />} />
              <Route path="/admin/trainer" element={<Trainer />} />
              <Route path="/admin/student-price" element={<GradePrice/>} />
              <Route path="/admin/student-view-admin" element={<AdminStudentView />} />
              <Route path="/admin/admin-trainer-student-grade" element={<AdminTrainerStudentGrade />} />
              <Route path="/admin/tstudent" element={<Tstudent />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
