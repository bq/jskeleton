'use strict';
/*globals Jskeleton, Backbone, _ */
/* jshint unused: false */

var utils = {};

//replace string chars (instead using encodeUrl)
utils.replaceSpecialChars = function(text) {
    if (typeof text === 'string') {

        var specialChars = 'ãàáäâèéëêìíïîòóöôùúüûÑñÇç \'',
            chars = 'aaaaaeeeeiiiioooouuuunncc--';

        for (var i = 0; i < specialChars.length; i++) {
            text = text.replace(new RegExp(specialChars.charAt(i), 'g'), chars.charAt(i));
        }
    }
    return text;
};

utils.normalizeComponentName = function(eventString) {
    var name = /@component\.[a-zA-Z_$0-9]*/g.exec(String(eventString))[0].slice(11);

    return name;
};

// utility method for parsing event syntax strings to retrieve the event type string
utils.normailzeEventType = function(eventString) {
    var eventType = /(\w)+\s*/g.exec(String(eventString))[0].trim();

    return eventType;
};

// utility method for extract @component. syntax strings
// into associated object
utils.extractComponentEvents = function(events) {
    return _.reduce(events, function(memo, val, eventName) {
        if (eventName.match(/@component\.[a-zA-Z_$0-9]*/g)) {
            memo[eventName] = val;
        }
        return memo;
    }, {});
};

// allows for the use of the @component. syntax within
// a given key for triggers and events
// swaps the @component with the associated component object.
// Returns a new, parsed components event hash, and mutate the object events hash.
utils.normalizeComponentKeys = function(events, components) {
    return _.reduce(events, function(memo, val, key) {
        var normalizedKey = Marionette.normalizeComponentString(key, components);
        memo[normalizedKey] = val;
        return memo;
    }, {});
};


var BackboneExtend = Backbone.Model.extend;

// Util function to correctly set up the prototype chain for subclasses.
// Override the Backbone extend implementation to integrate with Jskeleton.factory
// and with Jskeleton.Di Jskeleton.di
utils.FactoryAdd = function(name, protoProps, staticProps) {
    var Class = protoProps,
        Parent = this;

    if (_.isFunction(protoProps)) {
        Jskeleton.factory.add(name, Class, Parent);
    } else {
        //get the inherited class using default Backbone extend method
        Class = BackboneExtend.apply(this, Array.prototype.slice.call(arguments, 1));
        //add the inherited class to the Jskeleton.factory
        Jskeleton.factory.add(name, Class);

        return Class;
    }

};

Jskeleton.Utils = utils;