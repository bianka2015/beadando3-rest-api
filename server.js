var express = require('express');
var fortune = require('fortune');
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');


var server = express();
var store  = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/.proba' }
    },
    serializers: [{ type: jsonapi }]    
}); 


store.defineType('alapanyag', {
    nev: {type: String},
    mennyiseg: {type: String},
    recept: { 
        link: 'recept',
        inverse: 'alapanyagok',
        isArray: false
    }
});


store.defineType('recept', {
    nev: {type: String},
    ido: {type: String},
    leiras: {type: String},
    alapanyagok: { 
        link: 'alapanyag',
        inverse: 'recept',
        isArray: true
    }
});



server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
server.use(fortune.net.http(store));


var port = process.env.PORT || 8080;
store.connect().then(function () {
    server.listen(port, function () {
        console.log('JSON Api server started on port ' + port);
    });
});