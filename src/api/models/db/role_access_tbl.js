const { Sequelize, DataTypes, Model } = require("sequelize");

class role_access_tbl extends Model {
    static init(sequelize){
        return super.init({
            id:{
                primaryKey:true,
                type: DataTypes.STRING(36)
            },
            role_id:{
                primaryKey:true,
                type: DataTypes.STRING(36)
            },
            sequence_no:{
                type: DataTypes.INTEGER
            },
            header_id:{
                primaryKey:true,
                type: DataTypes.STRING(255)
            },
            label:{
                type: DataTypes.STRING(255)
            },
            is_header:{
                type: DataTypes.BOOLEAN
            },
            view:{
                type: DataTypes.BOOLEAN
            },
            create:{
                type: DataTypes.BOOLEAN
            },
            edit:{
                type: DataTypes.BOOLEAN
            },
            export:{
                type: DataTypes.BOOLEAN
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            created_by: DataTypes.STRING(36),
            updated_by: DataTypes.STRING(36)
        },
        {
            sequelize,
            freezeTableName:true,
            tableName:'role_access_tbl'
        })
    }   
}

module.exports = role_access_tbl