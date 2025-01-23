const Sequelize = require('sequelize');
const {db} = require('../../../config');
const api_user_tbl = require('./api_user_tbl');
const api_role_tbl = require('./api_role_tbl');
const api_role_routes_tbl = require('./api_role_routes');
const api_route_request_logs_tbl = require('./api_route_request_logs_tbl');
const api_session_history_tbl = require('./api_session_history_tbl');

const sequelize = new Sequelize({
    ...db
})

const models = {
    api_user_tbl: api_user_tbl.init(sequelize),
    api_role_tbl: api_role_tbl.init(sequelize),
    api_role_routes_tbl: api_role_routes_tbl.init(sequelize),
    api_route_request_logs_tbl: api_route_request_logs_tbl.init(sequelize),
    api_session_history_tbl: api_session_history_tbl.init(sequelize)
    // role_tbl:           require('./role_tbl').init(sequelize), 
    // role_access_tbl:    require('./role_access_tbl').init(sequelize),
    // user_tbl:           require('./user_tbl').init(sequelize)
}

//associations
Object.values(models)
.filter(model => typeof model.associate === 'function')
.forEach(model => model.associate(models));



module.exports = {
    sequelize,
    Sequelize,
    ...models
}