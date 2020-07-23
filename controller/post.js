const Post = require('../models/post')

exports.upLike = (req,res,next) => {
    postId = req.params.postId
    Post.findById(postId)
    .then(post => {
        post.like += 1;
        return post.save()
    })
    .then(result => {
        res.status(200).json({msg : 'like succes'})
    })
    .catch(err => console.log(err))
}

exports.downLike = (req,res,next) => {
    postId = req.params.postId
    Post.findById(postId)
    .then(post => {
        post.like -= 1;
        return post.save()
    })
    .then(resp => {
        res.status(200).json({msg : 'unlike succes'})
    })
}

exports.addComment = (req,res,next) => {
    const postId = req.params.postId;
    const content = req.body.content;
    const userId = req.userId
    Post.findById(postId)
    .then(post => {
        post.comment.push({
            content : content,
            user : userId
        })
        return post.save()
    })
    .then(post => {
        res.status(201).json({msg : 'comment succes'})
        
    })
    .catch(err => {
        console.log(err)
    })
}