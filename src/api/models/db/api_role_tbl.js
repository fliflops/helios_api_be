const {Model, DataTypes} = require('sequelize');

class api_role_tbl extends Model {
    static init(sequelize) {
        return super.init({
            role_id:{
                primaryKey:true,
                type: DataTypes.UUID
            },
            role_name:{
                type: DataTypes.STRING
            },
            is_active: {
                type: DataTypes.STRING
            },
            is_admin: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt:  DataTypes.DATE,
            created_by: DataTypes.STRING,
            updated_by: DataTypes.STRING
        },  
        {
            sequelize,
            tableName:'api_role_tbl',
            freezeTableName:true
        })
    }

    static associate (models) {
        this.role_routes = this.hasMany(models.api_role_routes_tbl,{
            sourceKey:'role_id',
            foreignKey:'fK_role_id'
        })
    }
}

module.exports = api_role_tbl;