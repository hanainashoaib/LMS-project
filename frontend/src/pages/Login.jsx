import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(''); 

  const handleLogin = async (role) => {
    setErrorMsg(''); 
    const email = prompt(`Enter ${role} Email:`);
    const password = prompt(`Enter ${role} Password:`);

    if (!email || !password) return;
    const endpoint = role === 'Teacher' ? 'teacher/login' : 'students/login';

    try {
      const res = await axios.post(`http://localhost:5000/api/${endpoint}`, { email, password });
      
      localStorage.setItem('token', res.data.token);
      
      if (role === 'Teacher') {
        navigate('/teacher-dashboard');
      } else {

        localStorage.setItem('studentData', JSON.stringify(res.data.data));
        navigate('/student-dashboard');
      }
    } catch (error) {
    
      const backendMessage = error.response?.data?.message;
      
      if (error.response && error.response.status === 403) {

        setErrorMsg(backendMessage || 'Your account has been removed from university portal');
      } else {
        setErrorMsg(backendMessage || 'Invalid Credentials. Please try again.');
      }
    }
  };

  return (
    <div className="card">
      <h2>Login Portal</h2>
      {errorMsg && (
        <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>
          {errorMsg}
        </div>
      )}

      <button onClick={() => handleLogin('Teacher')}>Login as Teacher</button>
      <button className="secondary" onClick={() => handleLogin('Student')}>Login as Student</button>
    </div>
  );
}