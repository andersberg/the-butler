
// BASE SETUP
// =============================================================================
import express, {Router} from 'express'
import bodyParser from 'body-parser'

const server      = new express()
const port        = process.env.PORT || 8080
const router      = new Router()
const apiRouter   = new Router()

// BODY PARSER SETUP
// =============================================================================
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

// SERVER ROUTES
// =============================================================================

// Middleware
router.use(function(req, res, next) {
    console.log('Connection detected: ' + req.method + ' on ' + req.url)
    next()
})

// Browser routes
router.get('/', function(req, res) {
    // res.send('<h1>Welcome to The Ape Butler Server!</h1>')
    
})
server.use('/', express.static('client'))
// server.use('/', express.static(path.join(__dirname, 'client')))

// Api Routes
apiRouter.get('/', function(req, res) {
    res.send('<h1>Welcome to The Ape Butler API!</h1>')
})

server.use('/api', apiRouter)

server.listen(port)
console.log('The Butler Server is running on port: ' + port)