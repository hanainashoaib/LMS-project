require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const http = require('http'); 
const { Server } = require('socket.io'); 

require('./utils/cronJobs');

const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
connectDB();

app.use(express.json());
app.use(cors("*")); 

const server = http.createServer(app); 
const io = new Server(server, {
  cors: ("*")
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


global.io = io; 

app.use('/api/teacher', teacherRoutes);
app.use('/api/students', studentRoutes); 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));