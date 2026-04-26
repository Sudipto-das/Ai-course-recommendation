const express = require('express');
const router = express.Router();
const multer = require('multer');


const { uploadCourse } = require('../controllers/course.controller')
const  authMiddleware  = require('../middlewares/auth.middleware')

const upload = multer({ dest: '/uploads' })

router.post('/upload', upload.single('file'), authMiddleware, uploadCourse);


module.exports = router;