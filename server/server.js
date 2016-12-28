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
        // aiResponse = json.result.parameters
        // console.log(`Response from API.ai: \n` + JSON.stringify(aiResponse))

        // let givenname = json.result.parameters.givenname
        // let lastname = json.result.parameters.lastname
        // console.log(givenname + ` ` + lastname)

        let aiResponse = {
            'givenname': json.result.parameters.givenname,
            'lastname': json.result.parameters.lastname,
            'fullname': json.result.parameters.givenname + ' ' + json.result.parameters.lastname
        }

        console.log(`API.ai: ` + aiResponse.fullname + `\n`)

        // slackWebClient.chat.postMessage(`@anders`, `Hello from The Butler Bot`, (err, res) => {
        //     if (err) {
        //         console.log('Error: ' + err)
        //     } else {
        //         console.log('Message sent: ' + res)
        //     }
        // })

        slackWebClient.users.list(function (err, users) {
            if (err) {
                console.log('Error:', err + `\n`);
            } else {
                console.log('Slack API:')
                console.log(`Matching: ` + aiResponse.fullname + `\n`);
                for (var i in users.members) {
                    if (users.members[i].real_name === aiResponse.fullname) {
                        let slackUser = users.members[i]
                        console.log(`Found match: \n` + slackUser.real_name + `, ID: ` + slackUser.id)
                        
                        slackWebClient.chat.postMessage(slackUser.id, `Hello ` + slackUser.real_name + `! You have a guest!`, (error, response) => {
                            if (error) {
                                console.error(`Error: ` + error)
                            } else {
                                console.log(`Message sent: ` + JSON.stringify(response))
                            }
                        })

                        response.json(slackUser)
                        return
                    }
                }
            }
        });

        // response.json(slackName)
    })

})
app.use('/api', router)

