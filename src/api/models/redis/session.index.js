const redis = require('../../../config/redis');
const {SchemaFieldTypes} = require('redis');

module.exports = async () => {
    console.log('Creating Session Index');
    //refresh index
    await redis.ft.dropIndex('helios_api:index:session')
    await redis.ft.create('helios_api:index:session', {
        '$.id': {
            type: SchemaFieldTypes.TAG,
            AS:'id'
        },
        '$.role_id':{
            type: SchemaFieldTypes.TAG,
            AS:'role_id'
        },  
        '$.token':{
            type: SchemaFieldTypes.TAG,
            AS:'token'
        },
        '$.refreshToken':{
            type: SchemaFieldTypes.TAG,
            AS:'refreshToken'
        },
        '$.expiry':{
            type: SchemaFieldTypes.TAG,
            AS:'expiry'
        },
        '$.route':{
            type: SchemaFieldTypes.TAG,
            AS:'route'
        }
    },
    {
        ON: 'JSON',
        PREFIX: 'helios_api:session'
    })
}