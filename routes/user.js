const express = require('express')

const router = express.Router()


const userControl = require('../controller/user')

router.get('/:username', userControl.getUser)

module.exports = router