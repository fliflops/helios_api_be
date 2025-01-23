const {keys} = require('./queues');
const booking_create_worker = require('./workers/booking-request/createBR.worker');
const trip_create_worker = require('./workers/trip/createTrip.worker');

module.exports = {
    workers: {
        booking_create_worker,
        trip_create_worker
    },
    keys
}