//حاجة بتخليني اعدي للصفحة التالية و لا لا
//بتأكد منها لو اليوزر دا عنده توكين = عامل لوجين و لا لا
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const auth = async(req,res,next)=>{
    try{
        //req=> header=> authorization 
        //replace Bearer with ""
        const token = req.header('Authorization').replace('Bearer ','')
        //رجع التوكن لاصله الي هوا اي دي اليوزرعشان اعرف هوا تبع مين بنفس مفتاح السر
        const decodedToken = jwt.verify(token, 'myKey')
        // بعد ما جبت الاي دي ادور على اليوزر بالاي دي و بالتوكن بتاعه
        const user = await User.findOne(
            {_id:decodedToken._id,'tokens.token':token}
        )
        if(!user){
            throw new Error('no user found')
        }
        //'طالما وصلت هنا يبقى اليوزر موجود 
        //بدل ما اعمل ريكويست كل شوية الauth هيتولى الموضوع دا
        //خد التوكن الي جالك ف الركويست الهيدير و احفظه جوا الداتا بتاعتك
        req.token = token
        //نفس الكلام لليوزر*******
        req.user = user
        next()
    }
    catch(e){
        res.status(500).send({
            data: 'not authorized'
        })
    }
    // next()
}
module.exports = auth
