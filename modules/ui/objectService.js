var extend = require('util')._extend;

var objectService = {
    buildList: function(settings, squelette, inputList) {
        var list = [];
        var objectFieldPrimarayKey = '';

        function getObjectFieldPrimarayKey(field, index) {

            if (squelette.model.fields[field].hasOwnProperty('key') & squelette.model.fields[field].key) {
                objectFieldPrimarayKey = field;
            }
        }

        var fields = Object.getOwnPropertyNames(squelette.model.fields);
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