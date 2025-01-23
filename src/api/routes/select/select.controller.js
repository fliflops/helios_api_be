const roleService = require('../../service/role.service');
exports.getRole = async(req,res,next) => {
    try{
        const data = await roleService.getRoles({
            is_active: 1
        });

        res.status(200).json(data.map(item => ({
            label: item.role_name,
            value: item.role_id
        })))
    }
    catch(e){
        next(e)
    }
}

