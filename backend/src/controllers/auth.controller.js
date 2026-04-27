const Admin = require('../models/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Admin created successfully"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.json({ admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};

