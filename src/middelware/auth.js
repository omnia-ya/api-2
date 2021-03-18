//حاجة بتخليني اعدي للصفحة التالية و لا لا
//بتأكد منها لو اليوزر دا عنده توكين = عامل لوجين و لا لا
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decodedToken = jwt.verify(token, 'myKey')
        const user = await User.findOne(
            {_id:decodedToken._id,'tokens.token':token}
        )
        if(!user){
            throw new Error('no user found')
        }
        req.token = token
        req.user = user
        //res.send(req.user)
        next()
        // res.send(user)
    }
    catch(e){
        res.status(500).send({
            data: 'not authorized'
        })
    }
    next()
}
module.exports = auth
