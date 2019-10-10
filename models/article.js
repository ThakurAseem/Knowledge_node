let mongoose = require('mongoose')

//article schema
let articleSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    author:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required:true
    }
})

let articles = module.exports = mongoose.model('article',articleSchema)

