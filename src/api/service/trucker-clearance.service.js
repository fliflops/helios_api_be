const { Sequelize } = require('../models/helios');
const kronosModel = require('../models/kronos');
const heliosModel = require('../models/helios');

const queryString = `Select  
            a.vehicle_id,
            b.trucker_id,
            b.name 'trucker_name',
            c.type 'vehicle_type'
            from vehicle a
            left join trucker b on a.trucker_id = b.id
            left join vehicle_type c on a.vehicle_type_id = c.id
            where a.status = 'ACTIVE'
            and b.status = 'ACTIVE' 
            `

exports.getVehicle = async({
    vehicle_id = null
}) => {
    return await kronosModel.sequelize.query(`${queryString} ${vehicle_id ? 'and a.vehicle_id = :vehicle_id' : ''}`,
        {
            type: Sequelize.QueryTypes.SELECT,
            replacements: {
                vehicle_id
            }
        }
    )
}

exports.getVehicleLocation = async({
    vehicle_id,
    trucker_id,
    location
}) => {
    return await kronosModel.sequelize.query(`
        Select 
        b.vehicle_id,
        c.code,
        d.trucker_id
        from vehicle_location a
        left join vehicle b on a.vehicle_id = b.id
        left join location c on a.location_id = c.id
        left join trucker d on b.trucker_id = d.id
        where b.status = 'ACTIVE'
        and b.vehicle_id = :vehicle_id 
        and d.trucker_id = :trucker_id
        and c.code       = :location
    `,{
        replacements: {
            vehicle_id,
            trucker_id,
            location
        },
        type: Sequelize.QueryTypes.SELECT
    })
    .then(result => JSON.parse(JSON.stringify(result)))
}

exports.getTrip = async(trip_no) => {
    return await heliosModel.trip_plan_hdr_tbl.findOne({
        where:{
            tripPlanNo: trip_no
        }
    }).then(result => result ? JSON.parse(JSON.stringify(result)) : null)
}

exports.getBr = async(trip_no) => {
    return await heliosModel.sequelize.query(`
        Select  
        a.brNo,
        a.tripPlan,
        b.brStatus,
        b.deliveryStatus,
        b.rudStatus
        from trip_br_dtl_tbl a
        left join booking_request_hdr_tbl b on a.brNo = b.bookingRequestNo
        where a.tripPlan = :trip_no and a.isDeleted = 0
    `,
    {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
            trip_no
        }
    })
}

exports.updateTrip = async({
    data,
    trip_no
}) => { 

    await heliosModel.trip_plan_hdr_tbl.update({
        ...data
    },
    {
        where:{
            tripPlanNo: trip_no
        }
    })

}