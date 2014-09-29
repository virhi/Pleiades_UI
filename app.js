var app      = require('express')(),
    pleiades = require('pleiades');

var settings = {
    orm: "mysql://user:password@localhost/database",
    objectsFolder: __dirname + '/objects'
};


pleiades(app, settings, function() {
    app.listen(8000);
});
