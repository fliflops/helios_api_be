const {Queue} = require('bullmq');
const {redis, redis_prefix} = require('../config/');

const connection= {
    ...redis
}

const keys = {
    booking_create_queue: redis_prefix+'job:api_create_booking',
    trip_create_queue: redis_prefix+'job:api_create_trip'  
}




exports.booking_create_queue = new Queue(keys.booking_create_queue,{
    connection
})

exports.trip_create_queue = new Queue(keys.trip_create_queue,{
    connection
})

exports.keys = keys;