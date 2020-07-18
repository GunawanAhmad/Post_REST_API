const express = require('express')
const feed = require('../controller/feed')
const router = express.Router()
const { body } = require('express-validator/check')

router.get('/posts', feed.getPost)

router.post('/post', [
    body('title').isLength({max : 95}),
    body('content').isLength({max : 90})
],feed.createPost)

router.get('/post/:postId', feed.getPostById)

router.post('/delete/:postId', feed.deletePost)

router.put('/edit/:postId', feed.editPost)



module.exports = router

