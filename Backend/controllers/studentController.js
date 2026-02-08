const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Student = require('../models/Student');
const { sendDeletionWarning } = require('../utils/cronJobs');
const jwt = require('jsonwebtoken');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "hanaina.135aug25gpt@gmail.com",
    pass: "ydeyvdsbxgkrknvs",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Mail connection error: ", error);
  } else {
    console.log("Mail is ready to send an email"); 
  }
});





exports.addStudent = async (req, res) => {
  try {
    console.log("Request Body:", req.body); 
    const { name, email, password, department, age, teacherName, profilePicture } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: 'Student email already exists' });

    

    const newStudent = new Student({
      name,
      email,
      password : password,
      department,
      age,
      teacherName,
      profilePicture,
      teacherId:req.user.id
    });

    await newStudent.save();
    

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'University Portal Registration',
      text: `Hello ${name},\n\nYou have been added to the university portal.\n\nCredentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease login to check your dashboard.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error('Email error:', error); 
      else console.log('Email sent:', info.response); 
    });

    res.status(201).json({ message: 'Student added and email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; 
    
  
    const query = { isDeleted: false };

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const student = await Student.findOne({ email }).populate('teacherId', 'name'); // Fix 6: Added semicolon
    if (!student) {
      return res.status(404).json({ message: 'Student account not found.' });
    }

    if (student.isDeleted) {
      return res.status(403).json({ message: 'Your account has been removed from univeristy portal' });
    }

    console.log("password:", password); 
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: student._id, role: 'student' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.status(200).json({ 
      message: 'Login success', 
      token, 
      role: 'student', 
      data: {
        id: student._id,
        name: student.name, 
        email: student.email,
        department: student.department,
        age: student.age,
        subjects: student.subjects,
        teacherId: student.teacherId} 
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
};




exports.updatePreviousStudents = async (req, res) => {
    try {
        await Student.updateMany(
            { isDeleted: { $exists: false } }, 
            { $set: { isDeleted: false } }
        );
        res.status(200).json({ message: "Previous records synchronized successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.softDeleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: studentId }, 
      { 
        $set: { 
          isDeleted: true, 
          deletedAt: new Date() 
        } 
      }, 
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (global.io) {
      console.log(`Emitting delete event to student: ${studentId}`); 
      global.io.to(studentId).emit('accountDeleted', {
        message: "Your account has been deleted by the teacher. Logging out..."
      });
    }

    res.json({ 
      message: "Student soft-deleted successfully.",
      data: updatedStudent 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, age } = req.body;
    await Student.findByIdAndUpdate(id, { name, department, age }, { new: true });
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};