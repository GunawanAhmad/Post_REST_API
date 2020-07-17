const {validationResult} = require('express-validator')
const Post = require('../models/post')
const product = require('../../Shop-App/models/product')

exports.getPost = (req,res,next) => {
    Post.find()
    .then(posts => {
        console.log(posts)
        res.status(200).json({
            message : 'Succes',
            post : posts
        })
    })
    .catch(err => console.log(err))
    
}

exports.createPost = (req,res,next) => {
    const title = req.body.title;
    const content =  req.body.content;
    const imageUrl = 'images/leaf.jpg'
    const error = validationResult(req)

    if(!error.isEmpty()) {
       const error = new Error('Maximum character exceded')
       error.statusCode = 422;
       throw error
    }

    const post = new Post({
        title : title,
        content : content,
        imageUrl : imageUrl,
        user : {
            name : 'Gunawan'
        },
        date : new Date()
    })
    post.save()
    .then(result => {
        res.status(201).json({
            message : 'Status Posted!',
            post : result
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
    
}

exports.getPostById = (req,res,next) => {
    const postId = req.params.postId;
    console.log(postId)
    Post.findById(postId)
    .then(post => {
        if(post) {
            res.status(200).json({message : 'Post found', post : post})
        } else {
            const error = new Error('Post not found')
            error.statusCode = 404;
        }
        
    })
    .catch(err => {
        console.log(err)
         if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}


exports.deletePost = (req,res,next) => {
    const postId = req.params.postId;
    Post.deleteOne({_id : postId})
    .then(result => {
        res.status(200).json({message : 'Delete Succes'})
    })
    .catch(err => console.log(err))
}