import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentList = () => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null); 
  const [editForm, setEditForm] = useState({ name: '', department: '', age: '' }); 
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/students?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setList(res.data.students);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchList(); }, [page]);

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/students/soft-delete/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchList(); 
    } catch (err) { alert("Delete failed"); }
  };

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/students/update/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchList();
    } catch (err) { alert("Update failed"); }
  };

  return (
    <div className="card" style={{ 
      maxWidth: '700px', 
      margin: '10px auto', 
      padding: '15px',
      overflow: 'hidden' 
    }}>


      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <h2 style={{
         textAlign: 'center',
         fontSize: '1.4rem' }}
      >Enrolled Students</h2>
      
  
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 1fr 0.6fr 1.3fr', 
        fontWeight: 'bold', 
        padding: '10px 0', 
        borderBottom: '2px solid #eee',
        fontSize: '0.9rem'
      }}>


        <span>Name</span>
        <span>Dept</span>
        <span style={{ textAlign: 'center' }}>Age</span>
        <span style={{ textAlign: 'center' }}>Actions</span>
      </div>



      {list.map((s) => (
        <div key={s._id} style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr 0.6fr 1.3fr', 
          padding: '10px 0', 
          borderBottom: '1px solid #eee', 
          alignItems: 'center' 
        }}>


          {editingId === s._id ? (
            <>

              <input style={{ 
                width: '85%',
                padding: '4px' 
                 }}
               value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />

              <input style={{
               width: '85%',
              padding: '4px'
              }}
                value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} />

              
              <input type="number" style={{
               width: '70%',
               padding: '4px', 
               textAlign: 'center' }}
               value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} />
              
              <div style={{
                 display: 'flex',
                 gap: '5px', 
                 justifyContent: 'center'
                 }}> 
                
                <button onClick={() => handleUpdate(s._id)} style={{ backgroundColor: '#28a745', padding: '5px 8px', fontSize: '0.8rem' }}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ backgroundColor: '#6c757d', padding: '5px 8px', fontSize: '0.8rem' }}>Cancel</button>
              </div>
            </>
          ) : (
            <>

              <span style={{ fontSize: '0.9rem' }}>{s.name}</span>
              <span style={{ fontSize: '0.9rem' }}>{s.department}</span>
              <span style={{ textAlign: 'center', fontSize: '0.9rem' }}>{s.age}</span>
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>

                <button onClick={() => { setEditingId(s._id); setEditForm({name: s.name, department: s.department, age: s.age}); }} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Update</button>
                <button onClick={() => handleSoftDelete(s._id)} style={{ backgroundColor: '#dc3545', padding: '4px 10px', fontSize: '0.8rem' }}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}


      <div style={{ 
       display: 'flex',
       justifyContent: 'center', 
       alignItems: 'center', 
       gap: '15px',
       marginTop: '20px' 
       }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ width: '60px', padding: '5px' }}>Prev</button>
        <span style={{ fontSize: '0.85rem' }}>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={{ width: '60px', padding: '5px' }}>Next</button>
      </div>

      <button className="secondary" onClick={() => navigate('/teacher-dashboard')} style={{ width: '100%', marginTop: '15px', padding: '10px' }}>Back</button>
    </div>
  );
};

export default StudentList;