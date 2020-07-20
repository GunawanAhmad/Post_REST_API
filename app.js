const express = require('express')
const feedRoute = require('./routes/feed')
const authRoute = require('./routes/auth')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const app = express()


const fileStorage  = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'images')
    },
    filename : (req,file,cb) => {
        cb(null,  uuidv4())
    }
})

const filterImg = (req,file,cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}



app.use(bodyParser.json())



app.use(multer({storage : fileStorage, fileFilter : filterImg}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT')
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
})

app.use('/feed',feedRoute)
app.use(authRoute)

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data
    console.log(error)
    res.status(422).json({message : message, errorData : data})
})


mongoose.connect('mongodb://localhost:27017/db', {
    dbName : 'Post-Rest-API'
})
.then(result => {
    app.listen(3000)
})
.catch(err => console.log(err))