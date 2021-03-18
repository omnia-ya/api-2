const express = require('express')
const User = require('../models/user.model')
const router = new express.Router()
// const userModel = require('../models/user.model')
const auth = require('../middelware/auth')
//show all
router.get('/all',async(req,res)=>{
    try{
        const users = await User.find({})
        res.status(200).send({
            apiStatus:true,
            data:users,
            message:'succ'
        })  
    }
    catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:'faild'
        })
    }
})
//reg user
router.post('/reg',async(req,res)=>{
    try{
     const user = new User(req.body)
     await user.save()
     res.status(200).send({
         apiStatus:true,
         data:user,
         message:'user inserted succesfully'
     })
    }
    catch(e){
     res.status(500).send({
         apiStatus:false,
         data: e.message,
         message:'failed regsteration'
     })
    }  
 })
//login
router.post('/login',async(req,res)=>{
    try{
        //ناديت الكلاس كله لان الفانكشن بتاعته static و دي خاصة بالكلاس ككل
        //طب ليه بنادي الكلاس كله لاني معايا ايميل و باس ليوزر انا معرفوش لسا
        //فلازم ادور ف الكلاس كله
        const user = await User.loginUser(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(200).send({
            apiStatus:true,
            data: {user,token},
            message:'logged in'
        })
    }
    catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"falid login"
        })
    }
})
//logout
router.post('logout',async(req,res)=>{
    try{

    }
    catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"falid logout"
        })
    }
})

module.exports = router
