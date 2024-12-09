const logger = require('../../config/logger');
const {env} = require('../../config');

const errorHandler = (err,req,res,next) => {
    console.log(err)
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || '';

    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: env === 'development' ? err.stack : {} 
    }) 

}

const validateReq = () => {

}

module.exports = {
    errorHandler, 
    validateReq
}

