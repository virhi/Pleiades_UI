

module.exports = function(app, settings, callback) {

    var request       = require('request');
    var twig          = require('twig');
    var objectService = require(__dirname + '/objectService.js');
    var RSVP          = require('rsvp');
    var menu          = [];

    app.set('views', __dirname + '/../../views');
    app.set('view engine', 'twig');
    app.engine('twig', twig.__express);


    app.get('/', function(req, res){
        res.render('index', {
            body : "Hello World"
        });
    });

    app.get('/test/:object', function(req, res) {
        sendPage(req, res, req.params.object, 'index');
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

    app.get('/list/:object', function(req, res, next) {

        var reqOptions = {
            url: settings.api.host + '/' + req.params.object,
            headers: {
                'User-Agent': 'request'
            }
        };

        var pageObject = buildPageObject(req, res, reqOptions, 'listItem', req.params.object, true);
        sendPage(pageObject);
    });

    app.get(settings.viewItemUrl + ':object/:id', function(req, res, next){
        var reqOptions = {
            method: 'GET',
            url: settings.api.host + '/' + req.params.object,
            headers: {
                'User-Agent': 'request',
                'X-Fields': '{"id": ' + req.params.id + '}'
            }
        };

        var pageObject = buildPageObject(req, res, reqOptions, 'item', req.params.object, false);
        sendPage(pageObject);
    });

    app.get(settings.editItemUrl + ':object/:id', function(req, res, next){

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
            sendResult(req, res, error, response, body, squelette, 'edit');
        });
    });


    app.get('/tag/edit', function(req, res) {

        object = {
            name: 'tag',
            plural: 'tags',
            model: {
                fields: {
                    id          : { type : "serial", key: true },
                    title       : { type: "text", required: true },
                    description : { type: "text", required: false }
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

        request(options, function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                sendResult(req, res, error, response, body, object, 'form');
            }
        });
    });

    app.post('/toto/edit', function(req, res) {

        var options = {
            method: 'POST',
            url: settings.api.host + '/tag',
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };

        request(options, function callback(error, response, body) {
            console.log(response.statusCode);
            sendResult(req, res, error, response, body, object, 'index');
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

    var sendPage = function(pageObject) {

        var options = {
            url: settings.api.host + '/objects/all',
            headers: {
                'User-Agent': 'request',
                'X-Fields':'{"name":"' + pageObject.objectName + '"}'
            }
        };

        request(options, function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var squelette = JSON.parse(body);
                sendResult(pageObject, squelette);
            }
        });
    }



    var sendResult = function(pageObject, squelette) {

        fields = objectService.getFields(settings, squelette);
        title  = objectService.getObjectName(settings, squelette);

        getMenu(menu);

        request(pageObject.reqOptions, function callback(error, response, body) {
            var sendOject = buildSendObject(pageObject, error, response, body, squelette, menu, title, fields);
            send(sendOject);
        });
    }

    var buildPageObject = function(req, res, reqOptions, renderView, objectName, buildList)
    {
        var objectName = typeof objectName !== 'undefined' ? objectName : false;
        var buildList = typeof buildList !== 'undefined' ? buildList : false;

        var pageObject = {
            'req' : req,
            'res' : res,
            'objectName' : objectName,
            'reqOptions' : reqOptions,
            'renderView' : renderView,
            'buildList'  : buildList
        }

        return pageObject;
    }

    var buildSendObject = function(pageObject, error, response, body, squelette, menu, title, fields)
    {
        var title  = typeof title !== 'undefined' ? title : '';
        var fields = typeof fields !== 'undefined' ? fields : [];

        var sendObject = {
            'res' : pageObject.res,
            'renderView': pageObject.renderView,
            'buildList' : pageObject.buildList,
            'error' : error,
            'response' : response,
            'body' : body,
            'squelette' : squelette,
            'menu' : menu,
            'title': title,
            'fields' : fields
        }

        return sendObject;
    }

    var send = function(sendObject) {
        if (sendObject.error) {
            throw sendObject.error;
        } else {
            switch (sendObject.response.statusCode) {
                case 200:
                case 201:
                    var jsonBody = JSON.parse(sendObject.body);
                    if (sendObject.buildList != false) {
                        body = objectService.buildList(settings, sendObject.squelette, jsonBody);
                    }

                    sendObject.res.render(sendObject.renderView, {
                        brand: settings.brand,
                        menu: sendObject.menu,
                        title: sendObject.title,
                        body : jsonBody,
                        fields: sendObject.fields
                    });
                    break;
                case 404:
                    sendObject.res.render('index', {
                        body : jsonBody
                    });
                    break;
                case 500:
                    sendObject.res.render('error', {
                        body : jsonBody
                    });
                    break;
            }
        }
    };

}