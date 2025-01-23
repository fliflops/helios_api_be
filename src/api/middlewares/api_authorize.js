const jwt = require('jsonwebtoken');
const {jwtAPISecret} = require('../../config');
const createHttpError = require('http-errors');
const userService = require('../service/user.service')

module.exports = (req,res,next) => {
    try{

        const token = req.headers['x-access-token'];

        if(!token) {
            throw createHttpError(401, 'Access Token is required')
        }

        jwt.verify(token, jwtAPISecret, async(error, decode) => {
            if(error) {
                return next(createHttpError(401, error))
            }

            const getUser = await userService.getUserRedisSession({
                token
            })
            .then(result => result.documents[0] ? result.documents[0].value : null)

            //validate route
            const route = req.originalUrl 
            const authorizedRoutes = getUser.routes.filter(item => item.is_authorize === 1).map(item => item.route)
            
            const isIncluded = authorizedRoutes.includes(route)

            if(!isIncluded) return next(createHttpError(401, 'Invalid Route Access'))

            req.processor = {
                id: getUser.id
            }

            return next()
            
        })
        

    }
    catch(e) {
        next(e)
    }
}