const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  age: { type: Number, required: true },
  dob : { type: Number },
  // teacherName : { type: String , default : 'Admin'},
  teacherId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'Teacher', 
  required: true 
},
  profilePicture: { type: String },
  isDeleted: { type: Boolean, default: false }, 
  deletedAt: { type: Date, default: null },
  subjects: { type: [String], default: ['Mathematics', 'Science', 'English'] }
} , { timestamps: true });



studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  // next();
});



module.exports = mongoose.model('Student', studentSchema);