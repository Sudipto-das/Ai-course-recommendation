const express = require("express");
const router = express.Router();

const { signup, login, getMe, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

module.exports = router;
