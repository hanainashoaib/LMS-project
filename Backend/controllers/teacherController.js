const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const Teacher = require('../models/Teacher');

exports.signupTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newTeacher = new Teacher({ name, email, password: hashedPassword });
    await newTeacher.save();
    
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


    const token = jwt.sign(
      { id: teacher._id, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login success', token, role: 'teacher' }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


