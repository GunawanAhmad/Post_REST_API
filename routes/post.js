const express = require('express')
const feed = require('../controller/feed')
const router = express.Router()
const postControl = require('../controller/post')
const isAuth = require('../middleware/isAuth')

router.put('/up/:postId',postControl.upLike)
router.put('/down/:postId', postControl.downLike)
router.post('/comment/:postId',isAuth, postControl.addComment)

module.exports = router