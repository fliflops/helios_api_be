const moment = require('moment');
const userService = require('../../service/user.service');
const roleService = require('../../service/role.service');
const httpErrors = require('http-errors');
const createHttpError = require('http-errors');

exports.getPaginatedUser = async(req,res,next) => {
    try{
        const query = req.query;
        const data = await userService.getPaginatedUser(query);
        res.status(200).json(data)

    }
    catch(e){
        next(e)
    }
}

exports.createUser = async(req,res,next) => {
    try{
        const data = req.body;
        const userId = req.processor.id;

        const user = await userService.getUser({
            username: data.username
        })

        if(user) throw  httpErrors(400, 'Username exists!');

        await userService.createUser({
            username: data.username,
            user_password: 'secret',
            app_key: data.app_key,
            fk_role_id: data.role_id,
            created_by: userId
        })

        return res.end();

    }
    catch(e){
        next(e)
    }
}

exports.updateUser = async(req,res,next) => {
    try{
        const data = req.body;
        const id = req.params.id;
        const user = req.processor.id;

        await userService.updateUser({
            data:{
                ...data,
                updated_by: user.id
            },
            filter:{
                id
            }
        })

        res.end();
    }
    catch(e){
        next(e)
    }
}

exports.generateAppKey = async(req,res,next) => {
    try{
        const key = await userService.randomCharGenerator(36)
        res.status(200).json({
            key
        })
    }
    catch(e){
        next(e)
    }
}

exports.generatePassword = async(req,res,next) => {
    try{
        const password = await userService.randomCharGenerator(12)
        res.status(200).json({
            password
        })
    }
    catch(e){
        next(e)
    }
}

exports.updatePassword = async(req,res,next) => {
    try{
        const data = req.body;
        const {username} = req.params;
        
        const userId = req.processor.id;
        console.log(data)

        const user = await userService.getUser({
            username: data.username
        })

        const isOldPasswordMatched = await userService.validateAuth({
            password: data.old_password,
            hashedPassword: user.user_password
        })
        
        if(!isOldPasswordMatched) throw httpErrors(400,'Invalid Old Password!');

        await userService.updateUser({
            data:{
                user_password: userService.hashPassword(data.new_password),
                updated_by: userId
            },
            filter:{
                username
            }
        })

        res.end();
    }

    catch(e){
        next(e)
    }
}

exports.getRedisSession = async(req,res,next) => {
    try{
        const user_id = req.processor.id;
        let isActiveSession = false;

        const session = await userService.getUserRedisSession({
            id:user_id
        })
        .then(result => result.documents[0] ? result.documents[0].value : null );

        if(session) {
            if(moment(session.expiry).format('X') > moment().format('X')){
                isActiveSession = true
            }
            else{
                isActiveSession = false
            }
        }

        res.status(200).json({
            expiry: session?.expiry,
            isActiveSession
        });
    }
    catch(e){
        next(e)
    }
}

exports.getAssignedRoutes = async(req,res,next) => {
    try{
        const {role_id} = req.query;
     
        const getRole = await roleService.getRole({
            role_id
        })

        if(!getRole) throw createHttpError(400, 'Invalid Role ID');
        const routes = getRole.routes.filter(item => item.is_authorize).map(item => {
            return {
                id: item.id,
                label: item.label,
                route: item.route,
                method: item.method
            }
        })
        
        res.status(200).json(routes);

    }
    catch(e){

    }
}

exports.getUserRequestLogs = async(req,res,next) => {
    try{
        const {
            route,
            ...query
        } = req.query;

        const user_id = req.processor.id;

        const data = await roleService.getPaginatedRouteLogs({
            ...query,
            route: route ?? null,
            fk_user_id: user_id
        })

        res.status(200).json(data)

    }
    catch(e){
        next(e)
    }
}

exports.killSession = async(req,res,next) => {
    try{
        const id = req.processor.id;
        const result = await userService.deleteSession(id);
        
        if(result < 1)  throw createHttpError(400,'No Active Session found!')

        return res.status(200).json({
            message: 'Success'
        })
    }
    catch(e){
        next(e)
    }
}