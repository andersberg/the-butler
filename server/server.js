'use strict'

// BASE SETUP
// =============================================================================
import express, {Router} from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import socketIo from 'socket.io'

const app           = new express()
const server        = http.Server(app)
const port          = process.env.PORT || 8080
const router        = new Router()
const apiRouter     = new Router()
const io            = new socketIo(server)


// BODY PARSER SETUP
// =============================================================================
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// SERVER ROUTES
// =============================================================================

// Middleware
router.use(function(request, response, next) {
    console.log('Connection detected: ' + request.method + ' on ' + request.url)
    next()
})

// Browser routes
router.get('/', function(request, response) {
    // response.send('<h1>Welcome to The Ape Butler Server!</h1>')
    
})
app.use('/', express.static('client'))
// app.use('/', express.static(path.join(__dirname, 'client')))

io.on(`connection`, (socket) => {
    console.log(`Connection detected!`)
})


// Api Routes
apiRouter.get('/', function(request, response) {
    response.send('<h1>Welcome to The Ape Butler API!</h1>')
})

apiRouter.post(`/`, (request, response) => {
    console.log(request.body.message)
    response.json({ message: `Welcome to The Butler API`})
})

app.use('/api', apiRouter)

app.listen(port)
// server.listen(8080,() => {
//     console.log(`listening on 8080`)
// })
console.log('The Butler Server is running on port: ' + port)
