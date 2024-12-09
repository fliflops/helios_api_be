const Sequelize = require('sequelize');
const {db} = require('../../../config');

const sequelize = new Sequelize({
    ...db
})

const models = {
    role_tbl:           require('./role_tbl').init(sequelize), 
    role_access_tbl:    require('./role_access_tbl').init(sequelize),
    user_tbl:           require('./user_tbl').init(sequelize)
}

module.exports = {
    sequelize,
    Sequelize,
    ...models
}