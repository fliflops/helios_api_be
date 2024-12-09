const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const {jwtSecret} = require('../../config');
const userService = require('../service/user.service')

module.exports = (req,res,next) => {
    try{
        const err = {
            message:'Invalid Access!',
            status: httpStatus.UNAUTHORIZED,
            isPublic: true
        };

        const token = req.headers['x-access-token'];
        
        if(!token){
            return res.status(401).json(err)
        }

        jwt.verify(token, jwtSecret, async(error, result) => {
            if(error) {
                return res.status(401).json(err)
            }

            const user = await userService.getUser({
                email: result.email
            })
           
            req.processor = {
                id: user.id                
            }

            return next()
        }) 

    }
    catch(e){
        next(e)
    }
}