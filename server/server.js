var express     = require('express');
var server      = express();
var port        = process.env.PORT || 4000;
var bodyParser  = require('body-parser');
var router      = express.Router();


server.listen(port);
console.log('The Butler Server is running on port: ' + port);