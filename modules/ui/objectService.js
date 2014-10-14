var extend  = require('util')._extend;
var request = require('request');
var RSVP    = require('rsvp');

var objectService = {



    getMenuP : function(structure, current) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            var menu = [];

            for (x in structure) {
                var isCurrant = false;

                if (x == current) {
                    isCurrant = true;
                }

                var tmpObj = {
                    name: structure[x].name,
                    url: '/list/' + structure[x].name,
                    current: isCurrant
                }
                menu.push(tmpObj);
            }
            resolve(menu);
        });
        return promise;
    },

    getStructurePromise: function(settings) {


        var promise = new RSVP.Promise(function(resolve, reject) {
            var reqOptions = {
                url: settings.api.host + '/objects/all',
                headers: {
                    'User-Agent': 'request'
                }
            };

            request(reqOptions, function callback(error, response, body) {

                if (error) {
                    throw error;
                } else {
                    switch (response.statusCode) {
                        case 200:
                        case 201:

                            var result   = {};
                            var tmpStruc = JSON.parse(body);
                            for (x in tmpStruc) {
                                result[tmpStruc[x].name] = tmpStruc[x];
                            }
                            resolve(result);
                            break;
                        case 404:
                            reject('404');
                            break;
                        case 500:
                            reject('500');
                            break;
                    }
                }
            });
        });

        return promise;
    },


    getListObject : function(settings, listFilter) {
        var promise = new RSVP.Promise(function(resolve, reject) {

            var reqOptions = {
                url: settings.api.host + '/' + listFilter.type,
                headers: {
                    'User-Agent': 'request'
                }
            };

            request(reqOptions, function callback(error, response, body) {

                if (error) {
                    throw error;
                } else {
                    switch (response.statusCode) {
                        case 200:
                        case 201:
                            resolve(JSON.parse(body));
                            break;
                        case 404:
                            reject('404');
                            break;
                        case 500:
                            reject('500');
                            break;
                    }
                }
            });

        });
        return promise;
    },


    getJson : function(reqOptions) {

        var promise = new RSVP.Promise(function(resolve, reject) {

            request(reqOptions, function callback(error, response, body) {

                if (error) {
                    throw error;
                } else {
                    switch (response.statusCode) {
                        case 200:
                        case 201:
                            resolve(JSON.parse(body));
                            break;
                        case 404:
                            reject('404');
                            break;
                        case 500:
                            reject('500');
                            break;
                    }
                }
            });
        });
        return promise;
    },

    getEmbedFields: function (settings, sendObject) {
        var collections = sendObject.collections;
        var models = sendObject.models;
        var tmpEmbedFields = [];

        var targetObjectsNameTmp = '';

        if (Array.isArray(collections)) {
            for (collectionsCompteur = 0; collectionsCompteur < collections.length; collectionsCompteur++) {
                var targetObjectsNameTmp =  collections[collectionsCompteur].targetObject;
                for (modelsCompteur = 0; modelsCompteur < models.length; modelsCompteur++) {
                    if (models[modelsCompteur].name == targetObjectsNameTmp) {
                        var tmpListField = models[modelsCompteur].model.fields;

                        for (field in tmpListField) {
                            if (tmpListField[field].hasOwnProperty('key') && tmpListField[field].key == true) {
                                var tpmObject = {
                                    name: collections[collectionsCompteur].fieldName,
                                    field: tmpListField[field].name
                                }
                                tmpEmbedFields.push(tpmObject);
                            }
                        }
                    }
                }
            }
        }

        return tmpEmbedFields;

    },

    getEmbedFieldsPromise: function (settings, collections, models) {


        var promise = new RSVP.Promise(function(resolve, reject) {

            var tmpEmbedFields = [];

            var targetObjectsNameTmp = '';

            if (Array.isArray(collections)) {
                for (collectionsCompteur = 0; collectionsCompteur < collections.length; collectionsCompteur++) {
                    var targetObjectsNameTmp =  collections[collectionsCompteur].targetObject;

                    for (x in models) {
                        if (x == targetObjectsNameTmp) {
                            var tmpListField = models[x].model.fields;
                            for (field in tmpListField) {
                                if (tmpListField[field].hasOwnProperty('key') && tmpListField[field].key == true) {
                                    var tpmObject = {
                                        name: collections[collectionsCompteur].fieldName,
                                        field: tmpListField[field].name
                                    }
                                    tmpEmbedFields.push(tpmObject);
                                }
                            }
                        }
                    }
                }
            }
            resolve(tmpEmbedFields);
        });
        return promise;
    },

    /* get fields for object description */
    getCollectionsPromise: function(settings, structure, objectName) {

        var promise = new RSVP.Promise(function(resolve, reject) {
            var squelette  = structure[objectName];
            var result     = null;
            var tmpFields  = squelette;
            var fieldsPath = settings.squeleteHasmany.split('.');

            function getIndex(field, index) {
                if (tmpFields.hasOwnProperty(field)) {
                    tmpFields  = tmpFields[field];
                    return true;
                } else {
                    tmpFields = null;
                    return false;
                }
            }

            fieldsPath.every(getIndex);

            result = tmpFields;
            resolve(result);
        });

        return promise;

    },


    buildMenu: function(structure) {
        var menu = [];
        function buildMenu(field, index) {
            var tmpObj = {
                name: field.name,
                url: '/list/' + field.name
            }
            menu[index] = tmpObj;
        };
        structure.forEach(buildMenu);

        return menu;
    },

    /* get fields for object description */
    getCollections: function(settings, squelette) {
        var result     = null;
        var tmpFields  = squelette;
        var fieldsPath = settings.squeleteHasmany.split('.');

        function getIndex(field, index) {
            if (tmpFields.hasOwnProperty(field)) {
                tmpFields  = tmpFields[field];
                return true;
            } else {
                tmpFields = null;
                return false;
            }
        }

        fieldsPath.every(getIndex);

        result = tmpFields;
        return result;
    },

    /* get fields for object description */
    getFieldsPromise: function(settings, structure, objectName) {

        var promise = new RSVP.Promise(function(resolve, reject) {
            var squelette  = structure[objectName];
            var result     = null;
            var tmpFields  = squelette;
            var fieldsPath = settings.squeleteFields.split('.');

            function getIndex(field, index) {
                if (tmpFields.hasOwnProperty(field)) {
                    tmpFields  = tmpFields[field];
                    return true;
                } else {
                    tmpFields = null;
                    return false;
                }
            }

            fieldsPath.every(getIndex);

            result = tmpFields;
            resolve(result);
        });

        return promise;
    },

    /* get fields for object description */
    getFields: function(settings, squelette) {
        var result     = null;
        var tmpFields  = squelette;
        var fieldsPath = settings.squeleteFields.split('.');

        function getIndex(field, index) {
            if (tmpFields.hasOwnProperty(field)) {
                tmpFields  = tmpFields[field];
                return true;
            } else {
                tmpFields = null;
                return false;
            }
        }

        fieldsPath.every(getIndex);

        result = tmpFields;
        return result;
    },

    /* get object name for squelete and settings */
    getObjectName: function(settings, squelette) {
        var result         = null;
        var tmpName        = squelette;
        var objectNamePath = settings.squeleteName.split('.');

        function getIndex(field, index) {
            if (tmpName.hasOwnProperty(field)) {
                tmpName  = tmpName[field];
                return true;
            } else {
                tmpName = false;
                return false;
            }
        }

        objectNamePath.every(getIndex);
        result = tmpName;

        return result;
    },

    /* build list object */
    buildList: function(settings, squelette, inputList) {
        var list                   = [];
        var objectFieldPrimarayKey = '';
        var squeletteFields        = this.getFields(settings, squelette);

        function getObjectFieldPrimarayKey(field, index) {

            if (squeletteFields[field].hasOwnProperty('key') & squeletteFields[field].key) {
                objectFieldPrimarayKey = field;
            }
        }

        var fields = Object.getOwnPropertyNames(squeletteFields);
        fields.forEach(getObjectFieldPrimarayKey, objectFieldPrimarayKey);

        function buildLink(item, index) {
            var objTmp = {
                link: {
                    self: settings.viewItemUrl + squelette.name + '/' + item[objectFieldPrimarayKey]
                }
            }

            extend(item,  objTmp);
            list.push(item);
        }

        inputList.forEach(buildLink);

        return list;
    }
}

module.exports = objectService;