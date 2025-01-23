const {Model, DataTypes} = require('sequelize');

class api_route_request_logs_tbl extends Model {
    static init (sequelize) {
        return super.init({
            id:{
                primaryKey:true,
                defaultValue: DataTypes.UUIDV4,
                type: DataTypes.UUID
            },
            fk_user_id:DataTypes.UUID,
            route: DataTypes.STRING,
            job_id: DataTypes.UUID,
            job_status: DataTypes.ENUM('ACTIVE','FAILED', 'DONE'),
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        {
            sequelize,
            tableName:'api_route_request_logs_tbl',
            freezeTableName: true
        })
    }
}

module.exports = api_route_request_logs_tbl;