const roleService = require('../../service/role.service');
const models = require('../../models/db');
const {v4:uuid} = require('uuid');
const createHttpError = require('http-errors');

exports.getPaginatedRole = async(req,res,next) => {
    try{
        const query = req.query;
        const data =  await roleService.getPaginated(query);
        res.status(200).json(data)
    }
    catch(e){
        next(e)
    }
}

exports.getRoutes = async(req,res,next) => {
    try{
        const routes =  await roleService.getRoleRoutes();
        res.status(200).json(routes);
    }
    catch(e){
        next(e)
    }
}

exports.createRole = async(req,res,next) => {
    const transaction = await models.sequelize.transaction();
    try{
        const {routes,...header} = req.body;
        const id = req.processor.id;
        const role_id = uuid();
        console.log(role_id)

        await roleService.createRole({
            ...header,
            role_id,
            created_by: id
        },transaction);

        await roleService.bulkCreateRoleRoute(routes.map(item => {
            return {
                ...item,
                fk_role_id: role_id,
                created_by: id
            }
        }),transaction)

        await transaction.commit();

        res.end();
    }
    catch(e){
        await transaction.rollback();
        next(e)
    }
}

exports.updateRole = async(req,res,next) => {
    const transaction = await models.sequelize.transaction();
    try{
        const { role_id } = req.params;
        const {routes,...header} = req.body;
        const id = req.processor.id;

        const newRouteData = routes.map(item => {
            return {
                ...item,
                is_authorize: item.is_authorize ? 1 : 0,
                fk_role_id: role_id
            }
        })

        await roleService.updateRole({
            data: {
                is_admin: header.is_admin,
                is_active: header.is_active,
                updated_by: id
            },
            filter:{
                role_id
            },
            stx: transaction
        })

        await roleService.bulkCreateRoleRoute(newRouteData, transaction, {
            updateOnDuplicate: ['is_authorize','updatedAt'],
        })

        await transaction.commit();

        //update role redis access
        await roleService.updateRedisRoleSessions(role_id,newRouteData)

        res.end();
    }
    catch(e){
        await transaction.rollback();
        next(e)
    }
}


exports.getRoleDetails = async(req,res,next) => {
    try{
        const {role_id} = req.params;
        const defaultRoutes = await roleService.getRoleRoutes();
        const data = await roleService.getRole({
            role_id
        })

        if(!data) throw createHttpError(404, 'Role not exists!');

        const {routes,...role_header} = data;

        const joinedRoute = defaultRoutes.map(item => {
            const a = routes.find(i => i.route === item.route)
            
            return {
                ...item,
                id: !a ? uuid() : a.id,
                is_authorize: !a ? false : a.is_authorize
            }
        })

        return res.status(200).json({
            ...role_header,
            routes: joinedRoute
        })
    }
    catch(e){
        next(e)
    }
}



