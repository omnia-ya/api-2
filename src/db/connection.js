const mongoose = require('mongoose')
try{
    mongoose.connect('mongodb://127.0.0.1:27017/hospitalApi',{
        useCreateIndex:true,
        useFindAndModify:true,
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
}
catch(e){
    console.log(e)
}