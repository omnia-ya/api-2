const mongoose = require('mongoose')
const validator = require('validator')
const bycrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')

////////schema
const userSchema = new mongoose.Schema({
    userId:{
        type:Number
    },
    userName:{
        type:String,
        trim:true
    },
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:40,
        match:/^[a-zA-Z]+$/
    },
    gender:{
        type:String,
        trim:true,
        enum:['male','female']
    },
    age:{
        type:Number,
        maxlength:2,
        match:/^[0-9]+$/
        //need match here or not//
    },
    phone:{
        type:String,
        trim:true,
        match:/^[0-9 -+]+$/
    },
    password:{
        type:String,
        required:true,
        trim:true,
        //Minimum eight characters, at least one letter, one number and one special character:
        // match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }
    },
    addresses:[
            {
            state:{
                stateType:{type:String},
                stateDetails:{type:String}
            },
            city:{
                cityType:{type:String},
                cityDetails:{type:String}
            }    
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
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
    // userProfile:{
    //     type:String
    // },
},
{timestamps:true})
//relations with others models
//doctors - date&time
// userSchema.virtual('modelName',{
//     ref:'modelName', //اسم المودل الي هربطه بيه
//     localField:'_id', //اسم المفتاح من المودل التاني
//     foreignFeild:'userId' //اسم المفتاح الي هيتربط بيه 
// })

userSchema.methods.toJSON = function(){
    const user = this.toObject()
    deleted = ['email','password','_id']
    deleted.forEach(element=>{
        delete user[element]
    })
    return user
}
////////bycrpt the password
//قبل اي عملية حفظ user.save() في السكيما لازم يعمل عملية التهشير
//بس لازم الباس يكزن جاي من الريكويست بس
//يعني لازم يكون هوا مدخل الباس بنفسه جوا الريكويست 
//مينفعش يتعمل تهشير لو كل مرة اليوزر بيعل فيعا ايديت لحاجة 
//عشان لما هيقارن الباس بيقارن بالي موجود بالداتابيز المتهشر

userSchema.pre('save',async function(next){
    const user = this
    //auto increment
    lastUser = await User.findOne({}).sort({_id:-1})
    if(!lastUser){
        user.userId = 1
    }
    else{
        user.userId = lastUser.userId+1
    }
    //لو الاوبجكت الي جايلك جواه مفتاح بعنوان باسوورد اعمل التهشير
    if(user.isModified('password')){
        user.password = await bycrpt.hash(user.password, 12)
    }
    //next => user.save()
    next()
})
//login function
//هاخد ايميل و باسوورد موجودين و لا لا
//هدور عالايميل الاول و لو لقيته هعمل مقارنة للباس هل نفسه و لا لا و نفس الي متهشر ف الداتابيو\ز و لا لا
userSchema.statics.loginUser = async(email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('no user found')
    }
    //لقيت الايميل خلاص هقارن الباس الي دخل دلوقتي بالي موجود ف الداتابيز المتهشر
    //password => الي دخلته 
    //user.password => الي متهشر في الداتابيز
    const isValidPass = await bycrpt.compare(password, user.password)
    if(!isValidPass){
        throw new Error('wrong password')
    }
    //لو الدنا تمام رجعلي اليوزر دا بقى
    return user
}
//token => حاجة بكريتها عشان البراوسر و الاي بي تاي يفهم انه هيدخل الصفحات الموجودة باليوزر دا
//بدون ما يحتاج يعمل لوجين كل شوية
//فبعمل الحتة دي عشان اخد التوكن دا و اوديه للفرونت اند فيفهم البروسر انه كدا عمل لوجين
/////////generate token
userSchema.methods.generateToken = async function(){
    const user = this
    //generate token
    const token = jwt.sign({_id:user._id.toString()}, 'myKey')
    //بعد كدا هزود على التوكنز القديمة التوكن الجديد الي لسا عملته حالا
    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token
}
//همسح المواعيد لخاصة بالمريض الواحد
// اعملها بعد ما اربط المودل دا بمودل المواعيد
// userSchema.pre('remove',async function(next){
//     user = this
//     //بمسح كل الداتا المتعلقة باليوزر دا بعدين اسمحه كله على بعضه
//     await dateModel.deleteMany({userId:user._id})
//     next()
// })
const User = mongoose.model('User',userSchema)
module.exports = User