const models = require('../models/helios');
const bcrypt = require('bcryptjs');

exports.getUser = async (filters) => {
    return await models.user_master_tbl.findOne({
        where:{
            ...filters
        }
    })
}

exports.validateAuth = async({
    password,
    hashedPassword
}) => {
    return bcrypt.compareSync(password,hashedPassword)
}

