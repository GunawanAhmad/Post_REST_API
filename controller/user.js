const User = require('../models/user')

exports.getUser = (req,res,next) => {
    const username = req.params.username
    User.findOne({username : username})
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

