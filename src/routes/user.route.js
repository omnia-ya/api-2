const express = require('express')
const User = require('../models/user.model')
const router = new express.Router()
const auth = require('../middelware/auth')
const { update } = require('../models/user.model')
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
router.post('/logout',async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((element)=>{
            return element!=req.token
        })
        await req.user.save()
        res.status(200).send({
            apiStatus:true,
            data:'',
            message:"logged out"
        })
    }
    catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"falid logout"
        })
    }
})
//logout from all devices
router.post('/logoutAll',async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save() 
        res.status(200).send({
            apiStatus:true,
            data:'',
            message:"logged out from all"
        }) 
    }
    catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"falid logout"
        })
    }
})
//show profile
router.get('/profile' ,auth, async(req,res)=>{
    res.send(req.user)
})
//remove account
router.delete('/me',auth, async(req,res)=>{
    try{
        await req.user.remove()
        res.status(200).send({
            apiStatus: true,
            data: "",
            message:'account removed'
        })
    }
    catch(e){
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message:'user register error'
        })
    }
})
//edit profile
router.patch('/user/profile',auth,async(req,res)=>{
    requestedUpdates = Object.keys(req.body)
    allowed = ['name','password']
    isValid = requestedUpdates.every(update=> allowed.includes(update))
    if(!isValid) return rew.send('invalid')
    try{
        requestedUpdates.forEash(update=> req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send({
            apiStatus:true,
            data:'',
            message:'updated'
        })
    }
    catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:'falid'
        })
    }
    
    
})
module.exports = router
