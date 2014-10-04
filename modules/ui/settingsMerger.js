var extend = require('util')._extend;

var settingsMerger = {
    merge: function(defaultSettings, inputSettings) {
        var settings = extend({}, defaultSettings);
        extend(settings,  inputSettings);
        return settings;
    }
}

module.exports = settingsMerger;