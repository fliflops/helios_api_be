const {Model, DataTypes} = require('sequelize')

class user_master_tbl extends Model {
    static init(sequelize) {
        return super.init({
            id:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:true
            },
            email: DataTypes.STRING,
            status: DataTypes.STRING,
            password: DataTypes.STRING
        },
        {
            sequelize,
            tableName:'user_master_tbl',
            timestamps:false
        })
    }
}

module.exports = user_master_tbl;