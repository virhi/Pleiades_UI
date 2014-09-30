var app      = require('express')(),
    pleiades = require('pleiades');

var settings = {
    orm: "mysql://root:root@localhost/database",
    objectsFolder: __dirname + '/objects'
};


pleiades(app, settings, function() {
    app.listen(3000);
});
