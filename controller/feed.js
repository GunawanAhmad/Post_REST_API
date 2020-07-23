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
    const content =  req.body.content;
    let imageUrl = undefined;
    const username = req.body.username;
    if(req.files['image']) {
        imageUrl = req.files['image'][0].path.replace("\\" ,"/")
    }
    const error = validationResult(req)

    if(!error.isEmpty()) {
       const error = new Error('Maximum character exceded')
       error.statusCode = 422;
       throw error
    }

    let user = null;
    let post = null;

    User.findOne({username : username})
    .then(creator => {
        user = creator
        post = new Post({
            content : content,
            imageUrl : imageUrl,
            user : {
                name : creator.name,
                username : creator.username,
                avatar : creator.imageProfile
            },
            date : new Date(),
            like : 0,
            comment : []
        })
        return post.save()
    })
    .then(result => {
        user.posts.unshift(post)
        return user.save()
    })
    .then(result => {
        res.status(201).json({msg : 'succes', post : post})
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

