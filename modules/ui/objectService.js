var extend  = require('util')._extend;
var request = require('request');

var objectService = {

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