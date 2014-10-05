

module.exports = function(app, settings, callback) {

    var request       = require('request');
    var twig          = require('twig');
    var objectService = require(__dirname + '/objectService.js');
    var menu          = [];

    app.set('views', __dirname + '/../../views');
    app.set('view engine', 'twig');
    app.engine('twig', twig.__express);


    app.get('/', function(req, res){
        res.render('index', {
            body : "Hello World"
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
            sendResult(req, res, error, response, body, {}, 'list');
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

            sendResult(req, res, error, response, body, object, 'listItem', true);

        });
    });

    app.get(settings.viewItemUrl + ':object/:id', function(req, res, next){

        var options = {
            method: 'GET',
            url: settings.api.host + '/' + req.params.object,
            headers: {
                'User-Agent': 'request',
                'X-Fields': '{"id": ' + req.params.id + '}'
            }
        };

        var squelette = {
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

        request(options, function(error, response, body) {
            sendResult(req, res, error, response, body, squelette, 'item');
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
            title: object.name,
            fields: object.model.fields
        });
    });

    var getMenu = function(menu) {

        var info = null;
        var options = {
            url: settings.api.host + '/objects/all',
            headers: {
                'User-Agent': 'request'
            }
        };


        function callback(error, response, body) {
            function buildMenu(field, index) {
                var tmpObj = {
                    name: field.name,
                    url: '/list/' + field.name
                }
                menu[index] = tmpObj;
            };

            if (!error && response.statusCode == 200) {
                info = JSON.parse(body);
                info.forEach(buildMenu);
            }
        }
        request(options, callback);
    };

    var sendResult = function(req, res, error, response, body, squelette, renderView, buildList) {

        buildList = typeof buildList !== 'undefined' ? buildList : false;

        fields = objectService.getFields(settings, squelette);
        title  = objectService.getObjectName(settings, squelette);

        getMenu(menu);

        if (error) {
            throw error;
        } else {
            switch (response.statusCode) {
                case 200:
                    var body = JSON.parse(body);

                    if (buildList != false) {
                        body = objectService.buildList(settings, squelette, body);
                    }
                    res.render(renderView, {
                        brand: settings.brand,
                        menu: menu,
                        title: title,
                        body : body,
                        fields: fields
                    });
                    break;
                case 404:
                    res.render('index', {
                        body : body
                    });
                    break;
            }
        }

    }

}