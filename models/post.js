const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    content : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String
    },
    user : {
        type : Object,
        required : true
    },
    like : {
        type : Number
    },
    date : {
        type : String,
        required : true
    },
    comment : [{
        content : {
            type : String,
            required : true
        },
        user : {
            type : Schema.Types.ObjectId,
            required : true
        }
    }]
}, {timestamps : true})

module.exports = mongoose.model('Post', postSchema)