const fs = require('fs');
const csv = require('csv-parser');
const Course = require('../models/course.model');


const uploadCourse = async (req, res) => {
    try {
        const results = [];

        fs.createReadStream(req.file.path)// create read stream from uploaded file
            .pipe(csv()) // CSV to JSON
            .on('data', (data) => {
                results.push({
                    course_id: data['Unique ID'],
                    title: data['Course Name'],
                    university: data['University Name'],
                    category: data['Discipline/Major'],
                    level: data['Course Level'],
                    description: data['Overview/Description'],
                    duration: data['Duration (Months)'],
                    url: data['Course URL']
                });

            })
            .on('end', async () => {
                await Course.insertMany(results)
                res.json({ message: "Courses uploaded successfully" });
            })
    } catch (err) {
        res.status(500).json({ error: err.message });

    }
}


module.exports = { uploadCourse }