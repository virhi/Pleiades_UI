
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

app.use(bodyParser());

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/public'));

var defaultSettings = {
    brand: 'Pleaides UI',
    api: {
        host: "http://10.10.10.161:3000"
    },
    viewListUrl: "/list/",
    viewItemUrl: "/item/",
    editItemUrl: "/edit/",
    createItemUrl: "/create/",
    deleteItemUrl: "/delete/",
    editResultItemUrl: "/edit_result/",
    createResultItemUrl: "/create_result/",
    squeleteFields: 'model.fields',
    squeleteHasmany: 'model.hasMany',
    squeleteName: 'name'
};

var controler      = require(__dirname + '/modules/ui/controler.js');
var settingsMerger = require(__dirname + '/modules/ui/settingsMerger.js');


module.exports = function(settings, callback) {
    settings = settingsMerger.merge(defaultSettings, settings);
    controler(app, settings, callback);
    app.listen(3000);
}
