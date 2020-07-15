const express = require('express')
const feedRoute = require('./routes/feed')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use(feedRoute)
app.listen(3000)