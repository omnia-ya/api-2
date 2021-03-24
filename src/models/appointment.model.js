const mongoose = require('mongoose')
const validator = require('validator')


const appSchema = new mongoose.Schema({
    userId:{
        type:Number
    },
    drId:{
        type:Number
    },
    from:{
        type:Number
    },
    to:{
        type:Number
    }
    // drName:{
    //     type:mongoose.Schema.Types.ObjectId
    //     //كزا دكتور 
    //     //نوضح الكشوفات القديمة او نمسح كل ما الكشف يخلص
    // },
    // clinicName:{
    //     type:mongoose.Schema.Types.ObjectId
    // },
    // patientStatus:{
    //     type:String
    // },
    // timeAndDate:{
    //     type:Date
    // },
    // analysis:{
    //     ///نرفع ملفات ازاي
    //     type:String
    // },
    // checkUp:[{
    //     checkUpStatus:{
    //         type:Boolean
    //     },
    //     checkUpType:{
    //         type:String,
    //         enum:['استشارة','كشف']
    //     }
    // }]
},
{timestamps:true})

appSchema.statics.checkApp = async(from)=>{
    console.log(from)
    const app = await Appointment.findOne({from})
    if(app){
        throw new Error('appointment already exist')
    }
   
    return app
}

const Appointment = mongoose.model('Appointment',appSchema)
module.exports = Appointment