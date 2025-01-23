const {Model, DataTypes} = require('sequelize');

class api_role_routes_tbl extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                primaryKey:true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            label: DataTypes.STRING,
            route: DataTypes.STRING,
            method: DataTypes.STRING,
            is_authorize: DataTypes.TINYINT,
            fk_role_id: DataTypes.UUID,
            created_by: DataTypes.STRING,
            updated_by: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        {
            sequelize,
            tableName: 'api_role_routes_tbl',
            freezeTableName: true
        })
    }
}

module.exports = api_role_routes_tbl;