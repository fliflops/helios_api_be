const { Sequelize, DataTypes, Model } = require("sequelize");

class user_tbl extends Model {
    static init(sequelize) {
        return super.init({
            user_id:{
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4   
            },
            user_email:{
                allowNull:false,
                type: DataTypes.STRING(255)
            },
            user_password:{
                allowNull:false,
                type: DataTypes.STRING(255)
            },
            is_active:{
                type: DataTypes.TINYINT(1)
            },
            fk_role_id:{
                type: DataTypes.STRING(36)
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            created_by: DataTypes.STRING(36),
            updated_by: DataTypes.STRING(36)
        },
        {
            sequelize,
            tableName:'user_tbl',
            freezeTableName:true
        })
    }
}

module.exports = user_tbl