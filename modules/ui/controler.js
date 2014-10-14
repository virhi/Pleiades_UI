

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
                                page.res.render('listItem', {
                                    page: 'yooo fields 1',
                                    list: list
                                });
                            }, function(error){
                                page.res.render('error', {
                                    error: 'fields error 1',
                                    list: list
                                });
                            });
                        }, function(error) {
                            page.res.render('error', {
                                error: 'embedFields error 1',
                                list: list
                            });
                        });
                    }, function(error){

                        page.res.render('error', {
                            error: 'collection error 1',
                            list: list
                        });
                    });

                },function(error) {
                    page.res.render('error', {
                        error: 'erreur list 1',
                        list: list
                    });
                });

            }, function(error){
                page.res.render('error', {
                    error: 'erreur menu 1',
                    list: list
                });
            })

        }).catch(function(error) {
            console.log('exption');
        });
    };


    var getPageItem = function (page, filter) {

        var list = {};
        list['objectName'] = filter.type;
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

            objectService.getMenuP(structure, filter.type).then(function(menu) {
                list['menu'] = menu;

                objectService.getObject(settings, filter).then(function(object) {
                    list['object'] = object;
                    objectService.getCollectionsPromise(settings, list.structure, filter.type).then(function(collection) {
                        list['collection'] = collection;

                        objectService.getEmbedFieldsPromise(settings, collection, structure).then(function(embedFields) {
                            list['embedFields'] = embedFields;

                            objectService.getFieldsPromise(settings, structure, filter.type).then(function(fields) {
                                list['fields'] = fields;
                                page.res.render('item', {
                                    page: 'yooo fields 1',
                                    list: list
                                });
                            }, function(error){
                                page.res.render('error', {
                                    error: 'fields error 1',
                                    list: list
                                });
                            });
                        }, function(error) {
                            page.res.render('error', {
                                error: 'embedFields error 1',
                                list: list
                            });
                        });
                    }, function(error){

                        page.res.render('error', {
                            error: 'collection error 1',
                            list: list
                        });
                    });

                },function(error) {
                    console.log(error);
                    error.res.render('error', {
                        page: 'erreur list 1',
                        list: list
                    });
                });

            }, function(error){
                error.res.render('error', {
                    page: 'erreur menu 1',
                    list: list
                });
            })

        }).catch(function(error) {
            console.log('exption');
        });
    };

    var getPageItemEdit = function (page, filter) {

        var list = {};
        list['objectName'] = filter.type;
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

            objectService.getMenuP(structure, filter.type).then(function(menu) {
                list['menu'] = menu;

                objectService.getObject(settings, filter).then(function(object) {
                    list['object'] = object;
                    objectService.getCollectionsPromise(settings, list.structure, filter.type).then(function(collection) {
                        list['collection'] = collection;

                        objectService.getEmbedFieldsPromise(settings, collection, structure).then(function(embedFields) {
                            list['embedFields'] = embedFields;

                            objectService.getFieldsPromise(settings, structure, filter.type).then(function(fields) {
                                list['fields'] = fields;
                                page.res.render('edit', {
                                    page: 'yooo fields 1',
                                    list: list
                                });
                            }, function(error){
                                page.res.render('error', {
                                    error: 'fields error 1',
                                    list: list
                                });
                            });
                        }, function(error) {
                            page.res.render('error', {
                                error: 'embedFields error 1',
                                list: list
                            });
                        });
                    }, function(error){

                        page.res.render('error', {
                            error: 'collection error 1',
                            list: list
                        });
                    });

                },function(error) {
                    console.log(error);
                    error.res.render('error', {
                        page: 'erreur list 1',
                        list: list
                    });
                });

            }, function(error){
                error.res.render('error', {
                    page: 'erreur menu 1',
                    list: list
                });
            })

        }).catch(function(error) {
            console.log('exption');
        });
    };

    var getPageCreate = function (page, filter) {

        var list = {};
        list['objectName'] = filter.type;
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

            objectService.getMenuP(structure, filter.type).then(function(menu) {
                list['menu'] = menu;
                objectService.getCollectionsPromise(settings, list.structure, filter.type).then(function(collection) {
                    list['collection'] = collection;

                    objectService.getEmbedFieldsPromise(settings, collection, structure).then(function(embedFields) {
                        list['embedFields'] = embedFields;

                        objectService.getFieldsPromise(settings, structure, filter.type).then(function(fields) {
                            list['fields'] = fields;
                            page.res.render('form', {
                                page: 'yooo fields 1',
                                list: list
                            });
                        }, function(error){
                            page.res.render('error', {
                                error: 'fields error 1',
                                list: list
                            });
                        });
                    }, function(error) {
                        page.res.render('error', {
                            error: 'embedFields error 1',
                            list: list
                        });
                    });
                }, function(error){

                    page.res.render('error', {
                        error: 'collection error 1',
                        list: list
                    });
                });

            }, function(error){
                error.res.render('error', {
                    page: 'erreur menu 1',
                    list: list
                });
            })

        }).catch(function(error) {
            console.log('exption');
        });
    };


    app.get('/test/:object/:id', function(req, res) {

        var filter = {
            type : req.params.object,
            id   : req.params.id
        }

        var page = {
            req : req,
            res: res
        }
        getPageItem(page, filter);
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
        getListPage(page, listFilter);
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
        getPageItem(page, filter);
    });

    app.get(settings.createItemUrl + ':object', function(req, res, next){

        var filter = {
            type : req.params.object
        }

        var page = {
            req : req,
            res: res
        }
        getPageCreate(page, filter);

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
        getPageItemEdit(page, filter);

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