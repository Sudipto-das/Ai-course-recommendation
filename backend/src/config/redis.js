const redis = require('redis');

const client = redis.createClient();

client.connect();

client.on('connect', () => {
    console.log("Redis Connected");
});

module.exports = client;