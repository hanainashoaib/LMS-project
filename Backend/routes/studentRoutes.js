const express = require('express');
const router = express.Router();
const { addStudent, getStudents, loginStudent, updatePreviousStudents, softDeleteStudent, updateStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware'); 


router.post('/add', protect, addStudent); 
router.get('/', protect, getStudents); 
router.put('/soft-delete/:id', protect, softDeleteStudent);
router.put('/update/:id', protect, updateStudent);

router.post('/login', loginStudent); 
router.put('/migrate', updatePreviousStudents); 

module.exports = router;


































// const express = require('express');
// const router = express.Router();
// const { addStudent, getStudents, loginStudent , updatePreviousStudents , softDeleteStudent , updateStudent } = require('../controllers/studentController');
// const { protect } = require('../middleware/authMiddleware');
// const authMiddleware = require('../middleware/authMiddleware');

// router.post('/add', authMiddleware , addStudent);     
// router.get('/', getStudents);         
// router.post('/login', loginStudent); 
// router.put('/migrate', updatePreviousStudents); 
// router.put('/soft-delete/:id', authMiddleware , softDeleteStudent);
// router.put('/update/:id', authMiddleware, updateStudent);    

// module.exports = router;