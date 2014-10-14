

module.exports = function(app, settings, callback) {

    var request       = require('request');
    var twig          = require('twig');
    var objectService = require(__dirname + '/objectService.js');
    var RSVP          = require('rsvp');
    var menu          = [];

    app.set('views', __dirname + '/../../views');
    app.set('view engine', 'twig');
    app.engine('twig', twig.__express);

    var getListPage = function (page, listFilter) {

        var list = {};
        list['objectName'] = listFilter.type;
        list['settings']   = settings;

        objectService.getStructurePromise(settings).then(function(structure) {
            list['structure'] = structure;

            return structure;

        }, function(value) {
            page.res.render('test', {
                page: 'sa a echoué 1',
                list: list
            });
        }).then(function(structure) {

            objectService.getMenuP(structure, listFilter.type).then(function(menu) {
                list['menu'] = menu;

                objectService.getListObject(settings, listFilter).then(function(listObject) {
                    list['listObject'] = listObject;
                    objectService.getCollectionsPromise(settings, list.structure, listFilter.type).then(function(collection) {
                        list['collection'] = collection;

                        objectService.getEmbedFieldsPromise(settings, collection, structure).then(function(embedFields) {
                            list['embedFields'] = embedFields;

                            objectService.getFieldsPromise(settings, structure, listFilter.type).then(function(fields) {
                                list['fields'] = fields;
                                page.res.render('test', {
                                    page: 'yooo fields 1',
                                    list: list
                                });
                            }, function(error){
                                page.res.render('test', {
                                    page: 'fields error 1',
                                    list: list
                                });
                            });



                        }, function(error) {
                            page.res.render('test', {
                                page: 'embedFields error 1',
                                list: list
                            });
                        });
                    }, function(error){

                        page.res.render('test', {
                            page: 'collection error 1',
                            list: list
                        });
                    });

                },function(error) {
                    console.log(error);
                    page.res.render('test', {
                        page: 'erreur list 1',
                        list: list
                    });
                });

            }, function(error){
                page.res.render('test', {
                    page: 'erreur menu 1',
                    list: list
                });
            })

        }).catch(function(error) {
            console.log('exption');
        });
    };

    app.get('/test/:object', function(req, res) {

        var listFilter = {
            type : req.params.object
        }

        var page = {
            req : req,
            res: res
        }
        getListPage(page, listFilter);
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

    app.get(settings.createItemUrl + ':object', function(req, res, next){

        var reqOptions = {
            method: 'GET',
            url: settings.api.host + '/' + req.params.object,
            headers: {
                'User-Agent': 'request'
            }
        };

        var formUrl    = settings.createResultItemUrl + req.params.object;
        var pageObject = buildPageObject(req, res, reqOptions, 'form', req.params.object, false, formUrl);
        sendPage(pageObject);

    });

    app.get(settings.editItemUrl + ':object/:id', function(req, res, next){

        var reqOptions = {
            method: 'GET',
            url: settings.api.host + '/' + req.params.object,
            headers: {
                'User-Agent': 'request',
                'X-Fields': '{"id": ' + req.params.id + '}'
            }
        };

        var formUrl    = settings.editResultItemUrl + req.params.object + '/' + req.params.id;
        var pageObject = buildPageObject(req, res, reqOptions, 'edit', req.params.object, false, formUrl);
        sendPage(pageObject);

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

        var structureOptions = {
            url: settings.api.host + '/objects/all',
            headers: {
                'User-Agent': 'request'
            }
        };

        request(structureOptions, function callback(structureError, structureResponse, structurebody) {
            if (!structureError && structureResponse.statusCode == 200) {

                var models = JSON.parse(structurebody);

                if (pageObject.pageInfo.objectName != false) {
                    var options = {
                        url: settings.api.host + '/objects/all',
                        headers: {
                            'User-Agent': 'request',
                            'X-Fields': '{"name":"' + pageObject.pageInfo.objectName + '"}'
                        }
                    };

                    request(options, function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var squelette = JSON.parse(body);
                            sendResult(pageObject, squelette, models);
                        }
                    });
                } else {
                    sendResult(pageObject, false);
                }

            }
        });
    }

    var sendResult = function(pageObject, squelette, models) {

        var fields = [];
        var collections = [];
        var title  = '';

        if (squelette != false) {
            fields = objectService.getFields(settings, squelette);
            collections = objectService.getCollections(settings, squelette);
            title  = objectService.getObjectName(settings, squelette);
        }

        getMenu(menu);

        request(pageObject.pageInfo.reqOptions, function callback(error, response, body) {

            var sendOject = buildSendObject(pageObject, error, response, body, squelette, models, menu, title, fields, collections);
            send(sendOject);
        });
    }

    var buildPageObject = function(req, res, reqOptions, renderView, objectName, buildList, urlForm)
    {
        var objectName = typeof objectName !== 'undefined' ? objectName : false;
        var buildList  = typeof buildList !== 'undefined' ? buildList : false;
        var urlForm    = typeof urlForm !== 'undefined' ? urlForm : false;

        var pageObject = {
            'req' : req,
            'res' : res,
            'pageInfo' : {
                'reqOptions' : reqOptions,
                'renderView' : renderView,
                'buildList'  : buildList,
                'objectName' : objectName,
                'urlForm' : urlForm
            }
        }

        return pageObject;
    }

    var buildSendObject = function(pageObject, error, response, body, squelette, models, menu, title, fields, collections)
    {
        var title  = typeof title !== 'undefined' ? title : '';
        var fields = typeof fields !== 'undefined' ? fields : [];
        var collections = typeof collections !== 'undefined' ? collections : [];

        var sendObject = {
            'res' : pageObject.res,
            'renderView': pageObject.pageInfo.renderView,
            'buildList' : pageObject.pageInfo.buildList,
            'urlForm' : pageObject.pageInfo.urlForm,
            'objectName' : pageObject.pageInfo.objectName,
            'error' : error,
            'response' : response,
            'body' : body,
            'squelette' : squelette,
            'menu' : menu,
            'title': title,
            'fields' : fields,
            'collections' : collections,
            'models' : models
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

                    var embedFields = objectService.getEmbedFields(settings, sendObject);

                    var page = {
                        settings: settings,
                        menu: sendObject.menu,
                        title: sendObject.title,
                        objectName: sendObject.objectName,
                        models: sendObject.models,
                        body : jsonBody,
                        fields: sendObject.fields,
                        embedFields: embedFields,
                        urlForm: sendObject.urlForm,
                        collections : sendObject.collections
                    }

                    sendObject.res.render(sendObject.renderView, {
                        page: page
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