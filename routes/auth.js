const express = require('express')
const router = express.Router()
const { body } = require('express-validator/check')
const User = require('../models/user')
const authControl = require('../controller/auth')





router.post('/signup', authControl.createUser)

router.post('/login', authControl.login)

module.exports = router