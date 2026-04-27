const express = require('express');
const router = express.Router();
const multer = require('multer');


const { uploadCourse ,searchCourses} = require('../controllers/course.controller')
const  authMiddleware  = require('../middlewares/auth.middleware')

const upload = multer({ dest: '/uploads' }) // set destination for uploaded files

router.post('/upload', upload.single('file'), authMiddleware, uploadCourse);
router.get('/', authMiddleware, searchCourses);


module.exports = router;