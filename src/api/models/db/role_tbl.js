const { Sequelize, DataTypes, Model } = require("sequelize");

class role_tbl extends Model {
    static init(sequelize) {
        return super.init({
            role_id:{
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            role_name:{
                allowNull:false,
                type: DataTypes.STRING(255)
            },
            is_active:{
                type: DataTypes.TINYINT(1)
            },
            is_admin:{
                type: DataTypes.TINYINT(1)
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            created_by: DataTypes.STRING(36),
            updated_by: DataTypes.STRING(36)
        },{
            freezeTableName: true,
            tableName:'role_tbl',
            sequelize
        })
    }
}

module.exports = role_tbl