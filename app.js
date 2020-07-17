const express = require('express')
const feedRoute = require('./routes/feed')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const app = express()


app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use('/feed',feedRoute)

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(422).json({message : message})
})


mongoose.connect('mongodb://localhost:27017/db', {
    dbName : 'Post-Rest-API'
})
.then(result => {
    app.listen(3000)
})
.catch(err => console.log(err))