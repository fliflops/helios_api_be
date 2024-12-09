const {Model, DataTypes} = require('sequelize')

class trip_plan_hdr_tbl extends Model {
    static init(sequelize) {
        return super.init({
            tripPlanNo:{
                type: DataTypes.STRING,
                primaryKey:true
            },
            actual_vendor: DataTypes.STRING,
            actual_vehicle_id: DataTypes.STRING,
            actual_vehicle_type: DataTypes.STRING,
            locationCode: DataTypes.STRING,
            cleared_by:  DataTypes.STRING,       
            date_cleared: DataTypes.STRING,      
            tripStatus:   DataTypes.STRING      
        },
        {
            sequelize,
            tableName:'trip_plan_hdr_tbl',
            timestamps: false
        })
    }
}

module.exports = trip_plan_hdr_tbl;