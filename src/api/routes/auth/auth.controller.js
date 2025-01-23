const userService = require('../../service/user.service');
const roleService = require('../../service/role.service');
const jwt = require('jsonwebtoken');
const {jwtSecret, jwtAPISecret, redis} = require('../../../config');
const createHttpError = require('http-errors');
const {jwtDecode} = require('jwt-decode');
const moment = require('moment');


exports.login = async(req,res,next) => {
    const error = 'Invalid username or password'
    try{
        const {username, password} = req.body;
        const user = await userService.getUser({
            username,
            is_active: 1
        })

        if(!user) throw createHttpError(400, error);
        if(user.is_active !== 1)  throw createHttpError(400, error);
        if(!user.api_role_tbl) throw createHttpError(400, 'No Assigned Role')

        const passwordMatch = await userService.validateAuth({
            password,
            hashedPassword: user.user_password
        })

        if(!passwordMatch) throw createHttpError(400, error)

        const token = jwt.sign({
                id: user.id,
                username: user.username
            },
            jwtSecret,
            {
                expiresIn:'24h'
            }
        )

        const role =  user.api_role_tbl ? {
            role_id: user.api_role_tbl.role_id,
            role_name: user.api_role_tbl.role_name,
            is_admin: user.api_role_tbl.is_admin,
            is_active: user.api_role_tbl.is_active
        } : null

        res.status(200).json({
            username,
            role,
            token
        })
    }
    catch(e){
        next(e)
    }
} 

exports.apiLogin = async(req,res,next) => {
    try{
        const error = createHttpError(400, 'Invalid Username or Password');
        const {
            username,
            password,
            appKey
        } = req.body;

        const getUser = await userService.getUser({
            username
        })

        if(!getUser) throw error;
        const passwordMatch = await userService.validateAuth({
            password,
            hashedPassword: getUser.user_password
        })

        if(!passwordMatch) return createHttpError(400, error);
        if(getUser.is_active !== 1)  throw error;
        if(!getUser.api_role_tbl) throw createHttpError(400, 'No Assigned Role');
        if(getUser.app_key !== appKey) throw createHttpError(400, error);

        //active session validation

        const roleRoutes = await roleService.getRoleDetails({
            fk_role_id: getUser.api_role_tbl.role_id
        })
        
        const token = jwt.sign({
            id: getUser.id,            
        },
        jwtAPISecret,
        {
            expiresIn: '24h'
        })

        const refreshToken = await userService.randomCharGenerator(36);
        
        await userService.createSessionHistory({
            fk_user_id: getUser.id,
            refresh_token: refreshToken,
            expiry: moment.unix(jwtDecode(token).exp).format('YYYY-MM-DD HH:mm:ss'),
            type: 'LOGIN'
        })

        await userService.createUserRedisSession({
            id: getUser.id,
            role_id: getUser.api_role_tbl.role_id,
            token,
            refreshToken,
            expiry: moment.unix(jwtDecode(token).exp).format('YYYY-MM-DD HH:mm:ss'),
            routes: roleRoutes
        })

        res.status(200).json({
            token,
            refreshToken,
            expiry: moment.unix(jwtDecode(token).exp).format('YYYY-MM-DD HH:mm:ss'),
            roleRoutes
        })

    }
    catch(e){
        next(e)
    }
}

exports.refreshToken = async(req,res,next) => {
    try{
        const body = req.body;

        //1. validate refresh token 
        const redisSession = await userService.getUserRedisSession({
            refreshToken: body.refreshToken
        })
        .then(result => result.documents[0] ? result.documents[0].value : null)

        if(!redisSession) throw createHttpError(401, 'Invalid Refresh Token')
        
        //2. check if the token is not expired
        if(moment(redisSession.expiry).format('X') > moment().format('X')) throw createHttpError(400, 'Active session found')

        //3. create new token
        const getUser = await userService.getUser({
            id: redisSession.id
        })

        if(!getUser) throw createHttpError(401, 'Invalid Refresh Token')
            
        const roleRoutes = await roleService.getRoleDetails({
            fk_role_id: getUser.api_role_tbl.role_id
        })
        
        const token = jwt.sign({
            id: getUser.id,            
        },
        jwtAPISecret,
        {
            expiresIn: '24h'
        })

        const refreshToken = await userService.randomCharGenerator(36);

        await userService.createSessionHistory({
            fk_user_id: getUser.id,
            refresh_token: refreshToken,
            expiry: moment.unix(jwtDecode(token).exp).format('YYYY-MM-DD HH:mm:ss'),
            type: 'REFRESH'
        })

        await userService.createUserRedisSession({
            id: getUser.id,
            role_id: getUser.api_role_tbl.role_id,
            token,
            refreshToken,
            expiry: moment.unix(jwtDecode(token).exp).format('YYYY-MM-DD HH:mm:ss'),
            routes: roleRoutes
        })

        res.status(200).json({
            token,
            refreshToken
        })
    }
    catch(e){
        next(e)
    }

}
