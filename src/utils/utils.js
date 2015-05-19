'use strict';
/*globals JSkeleton, Backbone, _, Marionette */
/* jshint unused: false */

var utils = {};

// RegExp @component htmlBars
utils.regExpComponent = /{{@component/ig;

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
    var eventType = /(\S)*/g.exec(String(eventString))[0].trim();

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
// Override the Backbone extend implementation to integrate with JSkeleton.factory
// and with JSkeleton.Di JSkeleton.di
utils.FactoryAdd = function(name /*,deps, protoProps, staticProps*/ ) {
    var areDeps = _.isArray(arguments[1]),
        ClassProperties = areDeps ? arguments[2] : arguments[1],
        Parent = this,
        deps = areDeps ? arguments[1] : undefined,
        Class;

    //the object has dependencies (as a function) but doesn't have an array with explicit dependencies
    if (deps === undefined && _.isFunction(ClassProperties)) {
        deps = JSkeleton.Di.extractDependencyNames(ClassProperties);
    }

    if (_.isFunction(ClassProperties)) {
        JSkeleton.factory.add(name, ClassProperties, Parent, deps);
    } else {
        //the class doesn't have dependencies
        //get the inherited class using default Backbone extend method
        Class = BackboneExtend.apply(this, Array.prototype.slice.call(arguments, 1));
        //add the inherited class to the JSkeleton.factory
        JSkeleton.factory.add(name, Class);

        return Class;
    }

};

JSkeleton.Utils = utils;