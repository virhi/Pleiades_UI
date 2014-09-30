var app      = require('express')(),
    pleiades = require('pleiades');

var settings = {
    orm: "mysql://root:root@localhost/pleiade",
    objectsFolder: __dirname + '/objects',
    exposeObjects: {
        active: true,
        path: '/objects/all'
    },
    importableObjects: {
        active: true,
        path: '/objects/import'
    }
};

pleiades(app, settings, function() {
    app.listen(4000);
});
