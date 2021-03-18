
const express = require('express')
const app = express()
require('./db/connection')
const usersRoutes = require('./routes/user.route')
const userModel = require('./models/user.model')
// x = new userModel({
//         name:'omnia',
//         phone:"+01111888811",
//         age:23, 
//         country:'canada',
//         password:'123omnia',
//         email:'hhhhhhnh@gmail.com'
//     })
//     x.save().then(()=>{}).catch(e=>{console.log(e)})
app.use(express.json())
app.use(usersRoutes)
module.exports = app