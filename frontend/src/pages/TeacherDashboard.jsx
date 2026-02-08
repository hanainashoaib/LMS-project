import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', age: ''  , teacherName : '' , profilePicture : ''});
  const navigate = useNavigate();

  const handleAddStudent = async () => {
    try {
      const token = localStorage.getItem('token'); 
      await axios.post('http://localhost:5000/api/students/add', form, {
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert("Student Added Successfully");
      window.location.reload();
    } catch (err) {
      alert("Unauthorized: Please login again");
      navigate('/login');
    }
  };

  return (
    <div className="card">
      <button className="top-right-btn" onClick={() => navigate('/login')}>Logout</button>
      <h2>Add New Student</h2>

      {/* <input 
      placeholder=" Admitted by (Teacher Name )"
      onChange={e => setForm ({ ...form , teacherName : e.target.value})}
      /> */}

      {/* <input 
        placeholder="https://cdn-icons-png.flaticon.com/512/67/67902.png" 
        onChange={e => setForm({...form, profilePic: e.target.value})} 
      /> */}
      
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <input placeholder="Department" onChange={e => setForm({...form, department: e.target.value})} />
      <input placeholder="Age" type="number" onChange={e => setForm({...form, age: e.target.value})} />
      <button onClick={handleAddStudent}>Add Student</button>
      <button className="secondary" onClick={() => navigate('/student-list')}>View Student List</button>
    </div>
  );
};

export default TeacherDashboard;