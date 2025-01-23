const redis = require('redis');
const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '../../.env')
})

module.exports = redis.createClient({
    socket:{
        host:process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        //passphrase: process.env.REDIS_PASSWORD
    }
})
