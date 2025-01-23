const models = require('../models/db');
const routes = require('../../data/routes');
const redis = require('../../config/redis');
const userService = require('../service/user.service');

exports.getRoles = async(filters = {}) => {
    return await models.api_role_tbl.findAll({
        where:{
            ...filters
        }
    })
}

exports.getRole = async(filters = {}) => {
    const data =  await models.api_role_tbl.findOne({
        include:[
            {
                model: models.api_role_routes_tbl,
                required:false
            }
        ],
        where:{
            ...filters
        }
    })
    .then(result => result ? JSON.parse(JSON.stringify(result)) : null)
    
    if(data) {
        const {api_role_routes_tbls,...role_header} = data;
        return {
            ...role_header,
            is_active: role_header.is_active === 1 ? true : false,
            is_admin: role_header.is_admin === 1 ? true : false,
            routes: api_role_routes_tbls.map(item => {
                return {
                    ...item, 
                    is_authorize: item.is_authorize === 1 ? true : false
                }
            })
        }
    }

    return data 
}

exports.getRoleDetails = async(filters = {}) => {
    const data = await models.api_role_routes_tbl.findAll({
        where:{
            ...filters
        }
    })
    .then(result => JSON.parse(JSON.stringify(result)))

    return data
}

exports.getRoleRoutes = async() => {
    return routes;
}

exports.getPaginated = async({
    page = 0,
    result = 0,
    order = [],
    ...filters
}) => {

    const {count,rows  } = await models.api_role_tbl.findAndCountAll({
        where:{
            ...filters
        },
        limit: parseInt(result),
        offset: parseInt(page) * parseInt(result),
        order: [['createdAt','DESC']]
    })
    .then(result => JSON.parse(JSON.stringify(result)))

    return {
        count, 
        rows,
        pageCount: Math.ceil(count/result)
    }
}

exports.getPaginatedRouteLogs = async({
    page = 0,
    result = 0,
    order = [],
    ...filters
}) => {
    const {count,rows} = await models.api_route_request_logs_tbl.findAndCountAll({
        where:{
            ...filters
        },
        limit: parseInt(result),
        offset: parseInt(page) * parseInt(result),
        order: [['createdAt','DESC']]
    })
    .then(result => JSON.parse(JSON.stringify(result)))


    return {
        count, 
        rows,
        pageCount: Math.ceil(count/result)
    }
}

exports.createRole = async(data={}, stx=null) => {
    return await models.api_role_tbl.create(data,{
        transaction: stx
    })
}

exports.bulkCreateRoleRoute = async(data = [], stx=null, options={}) => {
    return await models.api_role_routes_tbl.bulkCreate(data,{
        transaction: stx,
        ...options,
        
    })
}

exports.updateRole = async({
    data,
    filters,
    stx = null
}) => {
    return await models.api_role_tbl.update({
        ...data
    },
    {
        where:{
            ...filters
        },
        transaction: stx
    })
}

exports.updateRedisRoleSessions = async(role_id, routes=[]) => {
    const sessions = await userService.getUserRedisSession({
        role_id
    })

    sessions.documents.forEach(document => {
        redis.json.set(document.id, '.', {
            ...document.value,
            routes
        })
    })
}


