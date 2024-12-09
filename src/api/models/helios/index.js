const Sequelize = require('sequelize');
const {helios_db} = require('../../../config');
const trip_plan_hdr_tbl = require('./trip_plan_hdr_tbl');
const user_master_tbl = require('./user_master_tbl');

const sequelize = new Sequelize({
    ...helios_db
})

const models = {
    trip_plan_hdr_tbl: trip_plan_hdr_tbl.init(sequelize),
    user_master_tbl: user_master_tbl.init(sequelize)
}

module.exports = {
    sequelize,
    Sequelize,
    ...models
}

