const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes');

const app = express();


app.use(express.json());
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("/{*any}", cors(corsOptions))
app.use(cookieParser());
app.use('/api/auth', authRoutes);

module.exports = app;