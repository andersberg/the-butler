'use strict'

// BASE SETUP
// =============================================================================
import express, { Router } from 'express'
import bodyParser from 'body-parser'
import aiRequest from './../server/ai-request'
// import uuid from 'node-uuid'

const app = new express()
const port = process.env.PORT || 8080
const router = new Router()

var server = require('http').Server(app);
var io = require('socket.io')(server);

// var server = require('http').Server(app);

// API.AI Config
// const postURL = `https://api.api.ai/v1/query?v=20150910`
// const accessToken = `fa0f2e28ce9043b1a781e91c2fdaa850`
// var sessionId = uuid.v1()
var message = null
// let message = 'Anybody home?'

// BODY PARSER SETUP
// =============================================================================
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// SERVER ROUTES
// =============================================================================

// Middleware
app.use(function (request, response, next) {
    console.log('Connection detected: ' + request.method + ' on ' + request.url)
    next()
})

// Browser paths
app.use('/', express.static('client'))
// app.use('/record', express.static('client/record.html'))
// app.use('/', express.static(path.join(__dirname, 'client')))


// Api Routes
router.get('/', function (request, response) {
    response.send('<h1>Welcome to The Ape Butler API!</h1>')
})

router.post(`/`, (request, response) => {
    // response.json({ message: `Welcome to The Butler API` })

    message = request.body.message
    console.log(`Web Client: ` + message)

    // API.AI REQUEST
    // aiRequest(message, app)

    let requestBody = {
        "query": [
            message
        ],
        "timezone": "Europe/Stockholm",
        "lang": "en",
        "sessionId": sessionId
    }

    fetch(postURL, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + accessToken
        },
    }).then(function (res) {
        return res.json();
    }).then(function (json) {
        // console.log(json.result.parameters.givenname);
        aiResponse = json.result.parameters
        console.log(aiResponse)
        response.json(aiResponse)
    })

})
app.use('/api', router)

// io.on('connection', (socket) => {
//     socket.emit('news', { hello: 'wordl'})
//     socket.on('my other event', (data) => {
//         console.log(data)
//     })
// })

createServer(app)
app.listen(port)
console.log('The Butler Server is running on port: ' + port)