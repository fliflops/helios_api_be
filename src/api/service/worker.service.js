const models = require('../models').db;

exports.createWorkerLog = async(data) => {
    return await models.api_route_request_logs_tbl.create({
        ...data
    })
}

exports.updateWorkerLog = async({filters,data}) => {
    return await models.api_route_request_logs_tbl.update({
        ...data
    },
    {
        where:{
            ...filters
        }
    })
}