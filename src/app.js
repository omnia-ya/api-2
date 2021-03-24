
const express = require('express')
const app = express()
require('./db/connection')
const usersRoutes = require('./routes/user.route')
const appRoutes = require('./routes/appointment.route')
const userModel = require('./models/user.model')
const appModel = require('./models/appointment.model')
// x = new userModel({
//         name:'omnia',
//         phone:"+01111888811",
//         age:23, 
//         country:'canada',
//         password:'123omnia',
//         email:'hhhhhhnh@gmail.com'
//     })
//     x.save().then(()=>{}).catch(e=>{console.log(e)})
// y = new appModel({
//         userId:5,
//         drId:4,
//         from:5, 
//         to:6
//     })
//     y.save().then(()=>{}).catch(e=>{console.log(e)})
app.use(express.json())
app.use(usersRoutes, appRoutes)
module.exports = app