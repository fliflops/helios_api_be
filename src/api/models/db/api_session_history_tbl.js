const {Model, DataTypes} = require('sequelize');

class api_session_history_tbl extends Model {
    static init(sequelize) {
        return super.init({
            id:{
                primaryKey:true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            fk_user_id: DataTypes.UUID,
            refresh_token: DataTypes.STRING,
            expiry: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            type: DataTypes.ENUM('REFRESH', 'LOGIN')
        },
        {
            sequelize,
            tableName: 'api_session_history_tbl',
            freezeTableName:true
        })
    }
}

module.exports = api_session_history_tbl