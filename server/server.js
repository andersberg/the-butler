// BASE SETUP
// =============================================================================
var express     = require('express');
var server      = express();
var port        = process.env.PORT || 4000;
var bodyParser  = require('body-parser');
var router      = express.Router();
var apiRouter   = express.Router();

// BODY PARSER SETUP
// =============================================================================
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// SERVER ROUTES
// =============================================================================

// Middleware
router.use(function(req, res, next) {
    console.log('Connection detected: ' + req.method + ' on ' + req.url);
    next();
});

// Browser routes
router.get('/', function(req, res) {
    res.send('<h1>Welcome to The Ape Butler Server!</h1>');
});
server.use('/', router);

// Api Routes
apiRouter.get('/', function(req, res) {
    res.send('<h1>Welcome to The Ape Butler API!</h1>');
})

server.use('/api', apiRouter);

server.listen(port);
console.log('The Butler Server is running on port: ' + port);