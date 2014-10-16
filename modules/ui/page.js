var extend  = require('util')._extend;
var request = require('request');
var RSVP    = require('rsvp');
var objectService = require(__dirname + '/objectService.js');


var page = {

    getIndex : function (settings, page) {

        var list = {};
        list['objectName'] = 'index';
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

            objectService.getMenuP(structure, null).then(function(menu) {
                list['menu'] = menu;

            }, function(error){
                page.res.render('error', {
                    error: 'erreur menu 1',
                    list: list
                });
            })

        }).then(function() {
            page.res.render('list', {
                list: list
            });
        }).catch(function(error) {
            console.log(error);
            console.log('exption');
        });
    },

    getListPage : function (settings, page, listFilter) {

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

                        objectService.getEmbedFieldsPromise(settings, [], collection, structure).then(function(embedFields) {
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
    },


    getPageItem : function (settings, page, filter) {

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

                        objectService.getEmbedFieldsPromise(settings, object, collection, structure).then(function(embedFields) {
                            list['embedFields'] = embedFields;

                            objectService.getFieldsPromise(settings, structure, filter.type).then(function(fields) {
                                list['fields'] = fields;


                                var tpmCollection = [];

                                for (x in collection) {
                                    var url = collection[x].targetObject;
                                    tpmCollection.push(url);
                                }

                                var promises = tpmCollection.map(function(url){
                                    return objectService.getListObjecturl(settings, url);
                                });

                                RSVP.all(promises).then(function(embeded) {
                                    list['embeded'] = embeded;
                                    page.res.render('item', {
                                        page: 'yooo list object 1',
                                        list: list
                                    });
                                }, function (error) {

                                    page.res.render('error', {
                                        error: 'fields list object 1 ' + error,
                                        list: list
                                    });
                                })


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
    },

    getPageItemEdit : function (settings, page, filter) {

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

                        objectService.getEmbedFieldsPromise(settings, object, collection, structure).then(function(embedFields) {
                            list['embedFields'] = embedFields;

                            objectService.getFieldsPromise(settings, structure, filter.type).then(function(fields) {
                                list['fields'] = fields;

                                var tpmCollection = [];

                                for (x in collection) {
                                    var url = collection[x].targetObject;
                                    tpmCollection.push(url);
                                }

                                var promises = tpmCollection.map(function(url){
                                    return objectService.getListObjecturl(settings, url);
                                });

                                RSVP.all(promises).then(function(embeded) {
                                    list['embeded'] = embeded;
                                    page.res.render('edit', {
                                        page: 'yooo list object 1',
                                        list: list
                                    });
                                }, function (error) {

                                    page.res.render('error', {
                                        error: 'fields list object 1 ' + error,
                                        list: list
                                    });
                                })
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
    },

    getPageCreate : function (settings, page, filter) {

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

                    objectService.getEmbedFieldsPromise(settings, [], collection, structure).then(function(embedFields) {
                        list['embedFields'] = embedFields;

                        objectService.getFieldsPromise(settings, structure, filter.type).then(function(fields) {
                            list['fields'] = fields;

                            var tpmCollection = [];

                            for (x in collection) {
                                var url = collection[x].targetObject;
                                tpmCollection.push(url);
                            }

                            var promises = tpmCollection.map(function(url){
                                return objectService.getListObjecturl(settings, url);
                            });

                            RSVP.all(promises).then(function(embeded) {
                                list['embeded'] = embeded;
                                page.res.render('form', {
                                    page: 'yooo list object 1',
                                    list: list
                                });
                            }, function (error) {

                                page.res.render('error', {
                                    error: 'fields list object 1 ' + error,
                                    list: list
                                });
                            })

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
    }
}

module.exports = page;