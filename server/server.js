'use strict'

// BASE SETUP
// =============================================================================
import express, {Router} from 'express'
import bodyParser from 'body-parser'

const app           = new express()
const port          = process.env.PORT || 8080
const router        = new Router()
const apiRouter     = new Router()


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
console.log('The Butler Server is running on port: ' + port)
