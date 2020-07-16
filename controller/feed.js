const {validationResult} = require('express-validator')

exports.getPost = (req,res,next) => {
    res.status(200).json([{
        post : {
            _id : '1',
            title : 'API BRO',
            content : 'Work with Vue Bro',
            imageUrl : 'images/leaf.jpg',
            user : {
                name : 'Gunawan'
            },
            date : new Date()
        }
    }])
}

exports.createPost = (req,res,next) => {
    const title = req.body.title;
    const content =  req.body.content;
    const error = validationResult(req)

    if(!error.isEmpty()) {
        return res.status(422).json({message : 'Maximum character is reached', errors : error.array()})
    }
    console.log(title, content)
    res.status(201).json({
        message : 'status posted!',
        post : {
            _id : new Date().toString(),
            title : title,
            content : content,
            user : {
                name : 'Gunawan'
            },
            date : new Date
        }
    })
}