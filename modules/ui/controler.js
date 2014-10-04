

module.exports = function(app, settings, callback) {

    var request       = require('request');
    var twig          = require('twig');
    var objectService = require(__dirname + '/objectService.js');

    app.set('views', __dirname + '/../../views');
    app.set('view engine', 'twig');
    app.engine('twig', twig.__express);


    app.get('/', function(req, res){
        res.render('index', {
            message : "Hello World"
        });
    });

    app.get('/lists', function(req, res){

        var options = {
            url: settings.api.host + '/objects/all',
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, function(error, response, body){

            if (!error && response.statusCode == 200) {

                var body = JSON.parse(body);
                res.render('list', {
                    body : body
                });
            }

        });
    });

    app.get('/list/:object', function(req, res, next){

        var options = {
            url: settings.api.host + '/' + req.params.object,
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, function(error, response, body){

            object = {
                name: 'post',
                plural: 'posts',
                model: {
                    fields: {
                        id          : { type : "serial", key: true, list: true },
                        title       : { type: "text", list: true },
                        description : { type: "text", list: true }
                    }
                },
                methods : [
                    {name : 'GET'},
                    {name : 'POST'},
                    {name : 'PUT'},
                    {name : 'DELETE'}
                ]
            };

            if (error) {
                throw error;
            } else {
                switch (response.statusCode) {
                    case 200:
                        var body = JSON.parse(body);
                        res.render('listItem', {
                            list : objectService.buildList(object, body),
                            squelette: object

                        });
                        break;
                    case 404:
                        res.render('index', {
                            message : body
                        });
                        break;
                }
            }
        });
    });

    app.get('/tag/edit', function(req, res) {

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
            url: settings.api.host + '/objects/all',
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

}