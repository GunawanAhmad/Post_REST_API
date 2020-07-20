const express = require('express')
const feed = require('../controller/feed')
const router = express.Router()
const { body } = require('express-validator/check')
const isAuth = require('../middleware/isAuth')

router.get('/posts',isAuth, feed.getPost)

router.post('/post', [
    body('title').isLength({max : 95}),
    body('content').isLength({max : 90})
],isAuth,feed.createPost)

router.get('/post/:postId', feed.getPostById)

router.delete('/delete/:postId',isAuth, feed.deletePost)

router.put('/edit/:postId',isAuth, feed.editPost)



module.exports = router

