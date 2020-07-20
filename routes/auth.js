const express = require('express')
const router = express.Router()
const { body } = require('express-validator/check')
const User = require('../models/user')
const authControl = require('../controller/auth')




router.put('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email').custom((value, {req}) => {
        return User.findOne({email : value}).then(user => {
            if(user) {
                return Promise.reject('Email already exist')
            }
        })
    }).normalizeEmail(),
    body('password').trim().isLength({min : 3}).withMessage('Please enter password at least 3 character'),
    body('name').trim().not().isEmpty()
], authControl.createUser)

router.post('/login', authControl.login)

module.exports = router