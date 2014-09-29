/**
 * Created by virhi on 29/09/2014.
 */


var express = require('express');
var app = express();
var twig = require('twig');

app.set('views', __dirname + '/views');
app.set('view engine', 'twig');
app.engine('twig', twig.__express);

app.get('/', function(req, res){
    res.render('index', {
        message : "Hello World"
    });
});

app.listen(3000);