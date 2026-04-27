const fs = require('fs');
const csv = require('csv-parser');
const Course = require('../models/course.model');

const redisClient = require('../config/redis');
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



const searchCourses = async (req, res) => {
    try {
        const search = req.query.search?.trim();

        const cacheKey = `courses:${search || "all"}`;

        // Try Redis
        let cached;
        try {
            cached = await redisClient.get(cacheKey);
        } catch (err) {
            console.log("Redis read failed");
        }

        if (cached) {
            console.log("From Redis");
            return res.json(JSON.parse(cached));
        }

        //  Build query
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { category: { $regex: search, $options: "i" } },
                    { university: { $regex: search, $options: "i" } }
                ]
            };
        }

        //  Fetch from DB
        const courses = await Course.find(query);

        console.log("From MongoDB:", courses.length);

        //  Save to Redis
        try {
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(courses));
        } catch (err) {
            console.log("Redis write failed");
        }

        res.json(courses);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { uploadCourse, searchCourses };