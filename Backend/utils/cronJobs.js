const cron = require('node-cron');
const Student = require('../models/Student');


cron.schedule('0 0 * * *', async () => {
    console.log('Running Daily Cleanup: Hard deleting soft-deleted students of today...');

    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const result = await Student.deleteMany({
            isDeleted: true,
            updatedAt: { $gte: startOfDay, $lte: endOfDay }
        });

        console.log(`${result.deletedCount} student records permanently removed.`);
    } catch (error) {
        console.error('Cron Job Error:', error.message);
    }
});