const express = require('express')
const App = require('../models/appointment.model')
const router = new express.Router()
const auth = require('../middelware/auth')
// const { update } = require('../models/appointment.model')
//add new appointment
router.post('/newAppointment',async(req,res)=>{
    try{
     const app = new App(req.body)
     await app.save()
     res.status(200).send({
         apiStatus:true,
         data:app,
         message:'new appointment have been added'
     })
    }
    catch(e){
     res.status(500).send({
         apiStatus:false,
         data: e.message,
         message:'failed operation'
     })
    }  
 })
//check if there is an apponitment or not
router.post('/check',async(req,res)=>{
    try{
        const app = await App.checkApp(req.body.from)
        res.status(200).send({
            apiStatus:true,
            data: app,
            message:'register now'
        })
    }
    catch(e){
        res.status(500).send({
            apiStatus:false,
            data:e.message,
            message:"falid"
        })
    }
})
module.exports = router