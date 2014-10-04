
var express = require('express');
var app     = express();

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/public'));

var defaultSettings = {
    api: {
        host: "http://10.10.10.161:3000"
    }
};

var controler      = require(__dirname + '/modules/ui/controler.js');
var settingsMerger = require(__dirname + '/modules/ui/settingsMerger.js');


module.exports = function(settings, callback) {
    settings = settingsMerger.merge(defaultSettings, settings);
    controler(app, settings, callback);
    app.listen(3000);
}
