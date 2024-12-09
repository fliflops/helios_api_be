const userService = require('../../service/user.service');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../../../config')


exports.login = async(req,res,next) => {
    const error = 'Invalid username or password'
    try{
        const {email, password} = req.body;
        const user = await userService.getUser({
            email,
            status: 'AC'
        });

        if(!user) return res.status(400).json({messsage: error});
        //if(user.status !== 'AC')  return res.status(400).json({messsage: error});

        const passwordMatch = await userService.validateAuth({
            password,
            hashedPassword: user.password
        })

        if(!passwordMatch) return res.status(400).json({messsage: error});

        
        const token = jwt.sign({
                id: user.id,
                email: email
            },
            jwtSecret,
            {
                expiresIn:'24h'
            }
        )

        res.status(200).json({
            email,
            token
        });

    }
    catch(e){
        next(e)
    }
} 
