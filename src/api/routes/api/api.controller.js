const queues = require('../../../jobs/queues');
const {v4: uuid} = require('uuid')

exports.createBookingRequest = async(req,res,next) => {
    try{

        const user_id = req.processor.id;
        const job_id = uuid();

        await queues.booking_create_queue.add(uuid()+'route=POST/user/api/booking-request',{
            user_id,
            route: '/api/booking-request'
        },
        {
            jobId: job_id
        })

        res.status(200).json({
            message: 'Success'
        })

    }
    catch(e){
        console.log(e)
        next(e)
    }
}

exports.createTrip = async(req,res,next) => {
    try{
        const user_id = req.processor.id;
        const job_id = uuid();

        await queues.trip_create_queue.add(uuid()+'route=POST/user/api/trip',{
            user_id,
            route: '/api/trip'
        },
        {
            jobId: job_id
        })

        res.status(200).json({
            message: 'Success'
        })
    }
    catch(e){
        next(e)
    }
}
