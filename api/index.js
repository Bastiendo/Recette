var express = require('express');

var server = express();

// configuration des routes
server.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send("Le serveur est disponible");
});

// lancer le serveur
server.listen(1234, function() {
    console.log("le lanceur à démaré")
});