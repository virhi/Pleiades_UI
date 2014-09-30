/**
 * Created by virhi on 29/09/2014.
 */


var express = require('express');
var request = require('request');
var app = express();
var twig = require('twig');

app.set('views', __dirname + '/views');
app.set('view engine', 'twig');
app.engine('twig', twig.__express);
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index', {
        message : "Hello World"
    });
});

app.get('/tag/edit', function(req, res){

    object = {
        name: 'tag',
        plural: 'tags',
        model: {
            fields: {
                id          : { type : "serial", key: true },
                title       : { type: "text" },
                description : { type: "text" }
            }
        },
        methods : [
            {name : 'GET'},
            {name : 'POST'},
            {name : 'PUT'},
            {name : 'DELETE'}
        ]
    };

    var options = {
        url: 'http://10.10.10.160:3000/objects/all',
        headers: {
            'User-Agent': 'request'
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            console.log(info);
        }
    }

    request(options, callback);

    res.render('form', {
        formobject : object
    });
});

app.listen(3000);