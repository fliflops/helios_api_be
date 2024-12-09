const service = require('../../service/trucker-clearance.service');
const moment = require('moment');

exports.getTruckersSelect = async (req,res,next) => {
    try{
        const data = await service.getVehicle({});

        res.status(200).json(data.map(item => ({
            label: item.vehicle_id,
            value: item.vehicle_id
        })))
    }
    catch(e){
        next(e)
    }
}

exports.getTruckers = async(req,res,next) => {
    try{
        const {vehicle_id} = req.query;
       ;

        if(!vehicle_id || vehicle_id === '') return res.status(200).json(null)
        
        const data = await service.getVehicle({
            vehicle_id
        })

        res.status(200).json(data[0])

    }
    catch(e){
        next(e)
    }
}

exports.submitTrip = async(req,res,next) => {
    try{
        const {trip_no, plate_no, vehicle_type, trucker} = req.body;
        const id = req.processor.id

        const trip = await service.getTrip(trip_no)
        if(!trip)                                       return res.status(400).json({message: 'Invalid trip number.'})
        if(trip.tripStatus === 'TRUCKER_CLEARED')       return res.status(400).json({message: 'Invalid Trip Status: Trucker Cleared'})
        if(trip.tripStatus === 'SHORT_CLOSED')          return res.status(400).json({message: 'Invalid Trip Status: Short Closed'})
        if(trip.tripStatus !== 'DISPATCH_CONFIRMED')    return res.status(400).json({message: 'Invalid Trip Status'})
    
        const getBr = await service.getBr(trip_no)

        const getVehicle = await service.getVehicleLocation({
            vehicle_id: plate_no,
            trucker_id: trucker,
            location: trip.locationCode
        })

        const brValidation = getBr.find(item => item.brStatus !== 'VERIFIED_COMPLETE' || item.rudStatus !== 'CLEARED')
        const locationValidation = getVehicle.length > 0;

        if(!locationValidation) return res.status(400).json({message: 'Location mismatch between Plate Number and Trip Number. Please notify fleet team to verify and update'})
        
        if(brValidation) return res.status(400).json({message: 'Please clear the remaining uncleared invoices'})

        await service.updateTrip({
            data:{
                cleared_by:             id,
                date_cleared:           moment().format('YYYY-MM-DD HH:mm:ss'),
                tripStatus:             'TRUCKER_CLEARED',
                actual_vendor:          trucker,
                actual_vehicle_id:      plate_no,
                actual_vehicle_type:    vehicle_type
            },
            trip_no
        })

        res.end()
    }
    catch(e){
        next(e)
    }
} 