1. Navigate to the server directory:

2. cd backend
Install dependencies:

3. npm install
Environment Variables: Create a .env file in the backend root and add your credentials:

3. Code snippet

4. Run the server:

5. Development mode : index.js

6. Production mode: npm start

7. Verification: The server should now be running at http://localhost:5000.

8. Bulk Operations & Automation

 9. Student DOB Bulk Update
This endpoint is used to recalculate the birth year of all students based on their current age stored in the database.

 URL: /api/students/bulk-update-dob
 Method: PUT
 Authentication: Required (Teacher/Admin Token)
 Operation:- The script fetches the current year using new Date().getFullYear().
   It subtracts the student's age from the current year.
   It performs a bulkWrite operation to update the dob field for all records as a Number.

10.  Automated Cleanup (CronJob)
Name: StudentCleanupJob
Logic : Automatically scans the database for students where isDeleted: true
Hard deletes students who were soft deleted on the same day
Runs daily at 12:00 AM
Keeps the database clean
Frequency: Configured to run periodically to maintain database health.