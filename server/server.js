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

// Browser route
app.use('/', express.static('client'))
// app.use('/', express.static(path.join(__dirname, 'client')))


// Api Routes
router.get('/', function (request, response) {
    response.send('<h1>Welcome to The Ape Butler API!</h1>')
})

router.post(`/`, (request, response) => {
    response.json({ message: `Welcome to The Butler API` })

    message = request.body.message
    console.log(`Message from web client: ` + message)

    // API.AI REQUEST
    aiRequest(message);
})
app.use('/api', router)

app.listen(port)
console.log('The Butler Server is running on port: ' + port)
