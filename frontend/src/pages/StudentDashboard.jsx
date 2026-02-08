import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('studentData');
    if (data) {
      setStudent(JSON.parse(data));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (student && student._id) {
      socket.emit('joinRoom', student._id);
      socket.on('accountDeleted', (data) => {
        alert(data.message || "Your account has been deleted by the teacher.");

        localStorage.removeItem('studentData');
        localStorage.removeItem('token'); 
        navigate('/login');
      });
    }

    return () => {
      socket.off('accountDeleted');
    };
  }, [student, navigate]); 

  
  const teacherName = student?.teacherId?.name || 'Admin';

  if (!student) return <div>Loading...</div>;

  return (
    <div className="card" style={{ 
      maxWidth: '800px',
      width: '90%', 
      margin: '40px auto', 
      padding: '40px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
    }}>
      
      <button 
        className="top-right-btn" 
        onClick={() => {
          localStorage.removeItem('studentData');
          navigate('/login');
        }}>
        Logout
      </button>

      <div style={{ 
        textAlign: 'center', 
        borderBottom: '2px solid #f0f0f0', 
        marginBottom: '30px', 
        paddingBottom: '15px' 
      }}>
         <h3 style={{
           color: '#007bff',
           margin: 0,
           fontWeight: '500'
           }}>
           Admitted By: {teacherName}
         </h3>
      </div>

      <h2 style={{
          textAlign: 'center', 
          marginBottom: '40px', 
          fontSize: '2rem' }}>
        Student Profile
      </h2>

    
      <div style={{ 
        display: 'flex', 
        gap: '40px', 
        alignItems: 'flex-start', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        
        <div style={{ flexShrink: 0 }}>
          <img 
            src={student.profilePic || "https://cdn-icons-png.flaticon.com/512/67/67902.png"} 
            alt="Profile" 
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'cover', 
              borderRadius: '12px', 
              border: '2px solid #007bff',
              padding: '3px'
            }} 
          />
        </div>

        <div style={{ 
          flex: '1', 
          minWidth: '250px', 
          textAlign: 'left',
          fontSize: '1.1rem',
          lineHeight: '1.8'
        }}>
          <p style={{
              margin: '10px 0',
              borderBottom: '1px solid #fafafa'
            }}>
            <strong style={{
               width: '120px',
               display: 'inline-block'
               }}>Name:</strong> 
            {student.name}
          </p>

          <p style={{
              margin: '10px 0',
              borderBottom: '1px solid #fafafa'
             }}>
            <strong style={{
             width: '120px',
             display: 'inline-block'
            }}>Email:</strong> 
            {student.email}
          </p>

          <p style={{
              margin: '10px 0',
              borderBottom: '1px solid #fafafa'
             }}>
            <strong style={{
               width: '120px',
               display: 'inline-block'
               }}>Department:</strong> 
            {student.dept || student.department}
          </p>

          <p style={{
            margin: '10px 0',
            borderBottom: '1px solid #fafafa'
           }}>
            <strong style={{ 
              width: '120px',
              display: 'inline-block'
               }}>Age:</strong> 
            {student.age}
          </p>

          <p style={{ 
            margin: '10px 0'
             }}>
            <strong style={{ 
              width: '120px', 
              display: 'inline-block'
             }}>Subjects:</strong> 
            {student.subjects?.join(', ') || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}