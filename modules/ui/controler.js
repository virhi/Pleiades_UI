

module.exports = function(app, settings, callback) {

    var request       = require('request');
    var twig          = require('twig');
    var pageService   = require(__dirname + '/page.js');
    var RSVP          = require('rsvp');
    var menu          = [];

    app.set('views', __dirname + '/../../views');
    app.set('view engine', 'twig');
    app.engine('twig', twig.__express);



    app.get('/test/:object/:id', function(req, res) {

        var filter = {
            type : req.params.object,
            id   : req.params.id
        }

        var page = {
            req : req,
            res: res
        }
        pageService.getPageItem(settings, page, filter);
    });

    app.get('/', function(req, res){

        var reqOptions = {
            url: settings.api.host + '/objects/all',
            headers: {
                'User-Agent': 'request'
            }
        };

        var pageObject = buildPageObject(req, res, reqOptions, 'list', false);
        sendPage(pageObject);
    });

    app.get('/list/:object', function(req, res, next) {

        var listFilter = {
            type : req.params.object
        }

        var page = {
            req : req,
            res: res
        }
        pageService.getListPage(settings, page, listFilter);
    });

    app.get(settings.viewItemUrl + ':object/:id', function(req, res, next){
        var filter = {
            type : req.params.object,
            id   : req.params.id
        }

        var page = {
            req : req,
            res: res
        }
        pageService.getPageItem(settings, page, filter);
    });

    app.get(settings.createItemUrl + ':object', function(req, res, next){

        var filter = {
            type : req.params.object
        }

        var page = {
            req : req,
            res: res
        }
        pageService.getPageCreate(settings, page, filter);

    });

    app.get(settings.editItemUrl + ':object/:id', function(req, res, next){

        var filter = {
            type : req.params.object,
            id   : req.params.id
        }

        var page = {
            req : req,
            res: res
        }
        pageService.getPageItemEdit(settings, page, filter);

    });

    app.post(settings.editResultItemUrl + ':object/:id', function(req, res) {
        var options = {
            method: 'PUT',
            url: settings.api.host + '/' + req.params.object,
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/json',
                'X-Fields': '{"id": ' + req.params.id + '}'
            },
            body: JSON.stringify(req.body)
        };

        request(options, function callback(error, response, body) {

            res.redirect(settings.viewItemUrl + req.params.object + '/' + req.params.id);

        });
    });

    app.post(settings.createResultItemUrl + ':object', function(req, res) {
        var options = {
            method: 'POST',
            url: settings.api.host + '/' + req.params.object,
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };

        request(options, function callback(error, response, body) {
            var createObject = JSON.parse(body);
            res.redirect(settings.viewItemUrl + req.params.object + '/' + createObject[0].id);
        });
    });

    app.post(settings.editResultItemUrl + ':object/:id', function(req, res) {
        var options = {
            method: 'PUT',
            url: settings.api.host + '/' + req.params.object,
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/json',
                'X-Fields': '{"id": ' + req.params.id + '}'
            },
            body: JSON.stringify(req.body)
        };

        request(options, function callback(error, response, body) {

            res.redirect(settings.viewItemUrl + req.params.object + '/' + req.params.id);

        });
    });
}