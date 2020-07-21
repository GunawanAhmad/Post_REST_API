const {validationResult, body} = require('express-validator')
const Post = require('../models/post')
const User = require('../models/user')
const fileHelper = require('../util/file')
const ITEM_PER_PAGE = 2;

exports.getPost = (req,res,next) => {
    const page = +req.query.page || 1;
    let totalPost;
    Post.countDocuments()
    .then(num => {
        totalPost = num
        return Post.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
    })
    .then(posts => {
        res.status(200).json({
            message : 'Succes',
            post : posts,
            totalPost : totalPost,
            perPage : ITEM_PER_PAGE
        })
    })
    .catch(err => console.log(err))
    
}

exports.createPost = (req,res,next) => {
    const title = req.body.title;
    const content =  req.body.content;
    const imageUrl = undefined;
    let user;
    if(req.file) {
        imageUrl = req.file.path.replace("\\" ,"/")
    }
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
        user : req.userId,
        date : new Date()
    })
    post.save()
    .then(result => {
        return User.findById(req.userId)
    })
    .then(creator => {
        
        user = creator
        user.posts.push(post)
        console.log(user)
        return user.save()
    })
    .then(result => {
        res.status(201).json({
            message : 'Status Posted!',
            post : post,
            user : {
                _id : user._id,
                name : user.name
            }
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
    console.log(postId)
    Post.findById(postId)
    .then(post => {
        if(!post) {
            throw new Error('post not found')
        }
        if(post.imageUrl) {
            fileHelper.deleteFile(post.imageUrl)
        }
        return Post.deleteOne({_id : postId})
        .then(result => {
            res.status(200).json({message : 'Delete Succes'})
        })
    })
    .catch(err => console.log(err))
}

exports.editPost = (req,res,next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    
     
    Post.findByIdAndUpdate(postId)
    .then(post => {
        if(!post) {
            throw new Error('Post not Found')
        }
        if(req.file) {
            post.imageUrl = req.file.path.replace("\\" ,"/")
        }
        post.title = title;
        post.content = content;
        return post.save().then(result => {
            console.log('Edit Succes', result)
            res.status(200).json({message : 'Edit Succes', post : result})
        })
        
    })
    .catch(err => {
        next(err)
    })
}