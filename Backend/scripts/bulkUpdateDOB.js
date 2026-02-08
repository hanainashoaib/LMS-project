const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config();


const bulkUpdateDOB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await Student.find({});
        const currentYear = new Date().getFullYear();

        const bulkOps = students.map(student => {
            if (student.age) {
                const birthYear = currentYear - student.age;

                return {
                    updateOne: {
                        filter: { _id: student._id },
                        update: { $set: { dob: birthYear } } 
                    }
                };
            }
            return null;
        }).filter(op => op !== null);

        if (bulkOps.length > 0) {
            await Student.bulkWrite(bulkOps);
            console.log(`Successfully updated DOB Year for ${bulkOps.length} students.`);
        }
        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error.message);
    }
};

bulkUpdateDOB();