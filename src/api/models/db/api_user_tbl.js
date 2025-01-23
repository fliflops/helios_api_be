const {Model, DataTypes} = require('sequelize');

class api_user_tbl extends Model {
    static init(sequelize) {
        return super.init({
            id:{
                primaryKey:true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            username:{
                type: DataTypes.STRING
            },
            user_password:{
                type: DataTypes.UUID,
            },
            is_active:{
                type: DataTypes.TINYINT
            },  
            app_key:{
                type: DataTypes.UUID,
            },
            fk_role_id: DataTypes.UUID,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            created_by: DataTypes.STRING,
            updated_by: DataTypes.STRING
        },
        {
            sequelize,
            tableName: 'api_user_tbl',
            freezeTableName: true
        })
    }

    static associate(models) {
        this.role = this.hasOne(models.api_role_tbl, {
            sourceKey: 'fk_role_id',
            foreignKey: 'role_id'
        })
    }
 }

module.exports = api_user_tbl;