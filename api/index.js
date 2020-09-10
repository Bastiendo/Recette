var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

var server = express();

server.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods",  "PUT, GET, POST, DELETE")
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// configuration body parser
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

// configuration des routes
server.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send("Le serveur est disponible");
});

server.use('/api/', apiRouter);

// lancer le serveur
server.listen(1234, function() {
    console.log("le lanceur à démaré")
});