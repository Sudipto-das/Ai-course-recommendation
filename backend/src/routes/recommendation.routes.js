const router = require('express').Router();
const { getRecommendations } = require('../controllers/recommendation.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, getRecommendations);

module.exports = router;