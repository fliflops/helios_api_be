const Sequelize = require('sequelize')
const {kronos} = require('../../config')

const sequelize = new Sequelize({
    ...kronos
})

module.exports = {
    sequelize
}