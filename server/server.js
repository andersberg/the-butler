'use strict'

// BASE SETUP
// =============================================================================
import express, { Router } from 'express'
import { createServer } from 'http'
import bodyParser from 'body-parser'
import uuid from 'node-uuid'
import fetch from 'node-fetch'
import slackClient, { WebClient } from '@slack/client'

const app = new express()
const port = process.env.PORT || 8080
const router = new Router()

// API.AI Config
// Add security for prod-env
const postURL = `https://api.api.ai/v1/query?v=20150910`
const accessToken = `fa0f2e28ce9043b1a781e91c2fdaa850`
let sessionId = uuid.v1()
let message = null
let aiResponse = null

// Slackbot config
const slackToken = `xoxb-121768532438-soYL4i93cDnfs8j1QYqs3jNC`
const slackWebClient = new WebClient(slackToken)

// CREATE & RUN SEVER
// =============================================================================
createServer(app)
app.listen(port)
console.log('The Butler Server is running on port: ' + port)

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

// Api Routes
router.get('/', function (request, response) {
    response.send('<h1>Welcome to The Ape Butler API!</h1>')
})

router.post(`/`, (request, response) => {
    message = request.body.message
    console.log(`Web Client: ` + message)

    // API.AI REQUEST
    // =============================================================================
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
        aiResponse = json.result.parameters
        console.log(`Response from API.ai:` + JSON.stringify(aiResponse))
        response.json(aiResponse)
    })

})
app.use('/api', router)