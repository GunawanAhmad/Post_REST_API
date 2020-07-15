const express = require('express')
const feed = require('../controller/feed')
const router = express.Router()


router.get('/post', feed.getPost)
router.post('/posts', feed.postPost)

module.exports = router

