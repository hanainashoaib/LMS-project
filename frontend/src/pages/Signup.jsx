import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/teacher/signup', formData);
      alert('Signup Successful! Please Login.');
      navigate('/login');
    } catch (error) {
      alert('Error signing up');
    }
  };

  return (
    <div className="card">
      <h2>Teacher Signup</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button onClick={handleSubmit}>Sign Up</button>
      <p onClick={() => navigate('/login')} style={{cursor:'pointer', color:'blue'}}>
        Already have an account? Login
      </p>
    </div>
  );
}