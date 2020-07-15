exports.getPost = (req,res,next) => {
    res.status(200).json({
        feed : 'this is the fist post!'
    })
}

exports.postPost = (req,res,next) => {
    const title = req.body.title;
    const content =  req.body.content;
    console.log(title, content)
    res.status(201).json({
        message : 'status posted!'
    })
}