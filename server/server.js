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
const accessToken = `<ADD API.AI ACCESS TOKEN>` 
let sessionId = uuid.v1()
let message = null
let aiResponse = null

// Slackbot config
const slackToken = `<ADD SLACK API ACCESS TOKEN>`
const slackBotName = `The Ape Butler`
const slackWebClient = new WebClient(slackToken, slackBotName)

// CREATE & RUN SEVER
// =============================================================================
createServer(app)
app.listen(port)
console.log('The Butler Server is running on port: ' + port + `\n`)

// BODY PARSER SETUP
// =============================================================================
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// SERVER ROUTES
// =============================================================================

// Middleware
app.use(function (request, response, next) {
    // console.log('Connection detected!')
    next()
})

// Browser paths
app.use('/', express.static('client'))
app.use('/debug', express.static('client/debug.html'))
app.use('/bower_components', express.static('bower_components'));

// Api Routes
router.get('/', function (request, response) {
    response.send('<h1>Welcome to The Ape Butler API!</h1>')
})

router.post(`/`, (request, response) => {
    message = request.body.message
    console.log(`From Web Client: ` + message + `\n`)

    // API.AI REQUEST
    // =============================================================================
    let aiRequest = {
        "query": [
            message
        ],
        "timezone": "Europe/Stockholm",
        "lang": "en",
        "sessionId": sessionId
    }

    fetch(postURL, {
        method: 'POST',
        body: JSON.stringify(aiRequest),
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + accessToken
        },
    }).then(function (res) {
        return res.json();
    }).then(function (json) {

        let aiResponse = {
            'givenname': json.result.parameters.givenname,
            'lastname': json.result.parameters.lastname,
            'fullname': json.result.parameters.givenname + ' ' + json.result.parameters.lastname
        }

        console.log(`From API.ai: ` + aiResponse.fullname + `\n`)

        // SLACK  API REQUEST
        // =============================================================================
        slackWebClient.users.list(function (err, users) {
            if (err) {
                console.log('Error:', err + `\n`)
            } else {
                console.log(`Slack API - Matching: ` + aiResponse.fullname + `\n`)
                // Look for match among Slack members
                for (var i in users.members) {
                    if (users.members[i].real_name === aiResponse.fullname) {
                        let slackUser = users.members[i]
                        console.log(`Slack API - Found match: ` + slackUser.real_name + `, ID: ` + slackUser.id + `\n`)
                        
                        // Send message to matched Slack user
                        slackWebClient.chat.postMessage(slackUser.id, `Hello ` + slackUser.real_name + `! You have a guest!`, (error, response) => {
                            if (error) {
                                console.error(`Error: ` + error)
                            } else {
                                console.log(`Slack API - Message sent: ` + JSON.stringify(response.ok) + `\n`)
                            }
                        })
                        // Send response back to web client
                        response.json(slackUser)
                        return
                    }
                }
            }
        });
    })
})
app.use('/api', router)

