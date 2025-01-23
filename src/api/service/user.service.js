const models = require('../models/db');
const bcrypt = require('bcryptjs');
const redis = require('../../config/redis');
const jwt = require('jsonwebtoken');
const {jwtAPISecret,redis_prefix} = require('../../config');


exports.getPaginatedUser = async({
    page = 0,
    result = 0,
    order = [],
    ...filters
}) => {
    const {count,rows} = await models.api_user_tbl.findAndCountAll({
        include: [
            {
                model: models.api_role_tbl,
                required: false
            }
        ],
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
        rows: rows.map(({api_role_tbl,user_password,...item}) => {
            return {
                ...item,
                role_name: api_role_tbl?.role_name,
                role_id: api_role_tbl?.role_id,
                is_admin: api_role_tbl?.is_admin
            }
        }),
        pageCount: Math.ceil(count/result)
    }
}

exports.getUser = async (filters) => {
    return await models.api_user_tbl.findOne({
        include: [
            {
                model: models.api_role_tbl,
                required: false
            },
            
        ],
        where:{
            ...filters
        }
    })
}

exports.hashPassword = (password) => bcrypt.hashSync(password, 10);

exports.createUser = async(data={}, stx=null) => {
   const hashPassword = bcrypt.hashSync(data.user_password, 10);
   return await models.api_user_tbl.create({
        ...data,
        user_password: hashPassword    
    },
    {
        transaction: stx
    })
}   

exports.validateAuth = async({
    password,
    hashedPassword
}) => {
    return bcrypt.compareSync(password,hashedPassword)
}

exports.randomCharGenerator = async(length) => {
    let result = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

exports.updateUser = async({
    data={},
    filter={},
    stx = null
}) => {
    return await models.api_user_tbl.update({
        ...data
    },
    {
        where:{
            ...filter
        },
        transaction: stx
    })
}

exports.createUserRedisSession = async (data) => {
    return await redis.json.set(`helios_api:session:${data.id}`,'.',data)
}

exports.getUserRedisSession = async(filters) => {
    let tempFilter = '';
    Object.keys(filters).map(key => {
        tempFilter = `@${key}:{${filters[key].replace(/[-.@\\]/g, '\\$&')}}`
    })

    return await redis.ft.search('helios_api:index:session', tempFilter)
}

exports.validateAPIToken = async(token, callback=()=>{}) => {
    jwt.verify(token,jwtAPISecret, (err, decoded) => {
        if(err) {
           callback(err, null)
        }
        else{
            callback(null, decoded)
        }
    })
}

exports.deleteSession = async(user_id = '') => {
    const key = redis_prefix+'session:'+user_id
    return await redis.json.del(key, '.')
}

exports.createSessionHistory = async(data) => {
    return models.api_session_history_tbl.create(data)
}
 