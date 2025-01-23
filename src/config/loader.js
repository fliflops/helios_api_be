const redis = require('./redis');
const {workers} = require('../jobs');
const redisIndex = require('../api/models/redis')

module.exports = async () => {
    await redis.connect().then( async () => {
        console.log('Redis Client Connected');

        await redisIndex();
    })
    .catch(e => console.log(e));

    await workers.booking_create_worker();
    await workers.trip_create_worker();
}