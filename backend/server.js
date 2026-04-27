const app = require('./src/app');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;


const dns = require("dns");

// set custom DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);

connectDB();
app.listen(process.env.PORT, () => {
    console.log("server is running on port 5000")
})