const express = require('express')
const feed = require('../controller/feed')
const router = express.Router()
const { body } = require('express-validator/check')

router.get('/posts', feed.getPost)
router.post('/post', [
    body('title').isLength({max : 25}),
    body('content').isLength({max : 40})
],feed.createPost)

module.exports = router

