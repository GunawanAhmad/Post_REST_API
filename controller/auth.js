const {validationResult} = require('express-validator')
const Post = require('../models/post')
const User = require('../models/user')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.createUser = (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const error = new Error('Validation Failed')
        error.statusCode = 422;
        error.data = errors.array()
        throw error
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12).then(hashedPass => {
        const user = new User({
            email : email,
            name : name,
            password : hashedPass
        })
        return user.save()
    })
    .then(result => {
        res.status(200).json({message : 'Signup succes', id : result._id})
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })


}


exports.login = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser = null;
    User.findOne({email : email})
    .then(user => {
        if(!user) {
            throw new Error('Email is invalid')
        }
        loadedUser = user;
        console.log(loadedUser)
        return bcrypt.compare(password, user.password)
    })
    .then(isEqual=> {
        if(!isEqual) {
            const error = new Error('Wrong password')
            error.statusCode = 401
            throw error
        }
        const token = jwt.sign({
            email : loadedUser.email,
            userId : loadedUser._id.toString()
        }, 'thisissecretkey', { expiresIn : '1h' })
        res.status(200).json({token : token, userId : loadedUser._id.toString()})
        console.log('login succes')
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}