const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    university: String,
    category: String,
    level: String,
    description: String,
    duration: String,
    url: String
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);