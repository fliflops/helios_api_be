const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '../../.env')
})

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
    emailConfig: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_URL,
        expire: process.env.REDIS_SESSION_EXPIRE
    },
    db: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dialect: 'mysql',
        pool:{
            max: 10,
            min: 1,
            idle: 2000000,
            acquire: 2000000
        },
        logging: process.env.NODE_ENV === 'development',
        dialectOptions: {
            //useUTC: false, //for reading from database
            dateStrings: true,
            typeCast: true
        },
        timezone: '+08:00' /**for writing to database**/
    },
    kronos: {
        host: process.env.KRONOS_DB_HOST,
        database: process.env.KRONOS_DB,
        username: process.env.KRONOS_DB_USER,
        password: process.env.KRONOS_DB_PASSWORD,
        dialect: 'mysql',
        pool:{
            max: 10,
            min: 1,
            idle: 2000000,
            acquire: 2000000
        },
        logging: process.env.NODE_ENV === 'development',
        dialectOptions: {
            //useUTC: false, //for reading from database
            dateStrings: true,
            typeCast: true
        },
        timezone: '+08:00' /**for writing to database**/
    },
    helios_db: {
        username:       process.env.POD_DB_USER_NAME,
        password:       process.env.POD_DB_PASSWORD,
        host:           process.env.POD_DB_HOST,
        database:       process.env.POD_DB,
        dialect:        'mssql',
        dialectOptions : {
            options:{
                requestTimeout: 3600000,
                useUTC: false
            }
        },
        pool: { 
            max: 1000000,
            min: 0,
            idle: 2000000,
            acquire: 2000000,
            idleTimeoutMillis: 50,
            evictionRunIntervalMillis: 5,
            softIdleTimeoutMillis: 5,
            logging: process.env.NODE_ENV === 'development'
        }
    }
}