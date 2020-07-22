const User = require('../models/user')

const Post = require('../models/post')
const  mongoose  = require('mongoose')
const { unsubscribe } = require('../routes/feed')


exports.getUser = (req,res,next) => {
    const username = req.params.username
    User.findOne({username : username})
    .populate('posts')
    .exec()
    .then(user => {
        if(!user) {
            const error = new Error('username not found')
            throw error
        }
       
        res.status(200).json({msg : 'succes', user : user})
    })
    .catch(err => {
        next(err)
    })
}


