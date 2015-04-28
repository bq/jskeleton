'use strict';
/*globals Marionette, Jskeleton, _, Backbone */
/* jshint unused: false */


//Application object factory
var factory = {};


//Default available factory objects
factory.prototypes = {
    Model: Backbone.Model,
    Collection: Backbone.Collection
};

//Available singletons objects
factory.singletons = {};

//Adds an object class to the factory
factory.add = function(key, obj) {
    if (this.prototypes[key]) {
        throw new Error('AlreadyDefinedFactoryObject - ' + key);
    }
    this.prototypes[key] = obj;
};


//Creates a new object.
//Can recieve an object class or a string object factory key.
factory.new = function(obj, options) {
    options = options || {};

    var FactoryObject;

    if (typeof obj === 'object' || typeof obj === 'function') {
        FactoryObject = obj;
    } else {
        FactoryObject = this.prototypes[obj];
    }

    if (!FactoryObject) {
        throw new Error('UndefinedFactoryObject - ' + obj);
    }

    return new FactoryObject(options);
};


//Creates a new singleton object o retrieves the created one
factory.singleton = function(obj, options) {
    options = options || {};

    if (!this.singletons[obj]) {
        this.singletons[obj] = this.new(obj, options);
    }

    return this.singletons[obj];
};


//Retrieves an Object reference
factory.get = function(obj) {
    if (!this.prototypes[obj]) {
        throw new Error('UndefinedFactoryObject - ' + obj);
    }
    return this.prototypes[obj];
};

//Gets all objects added to the factory
factory.getAll = function() {
    return this.prototypes;
};


Jskeleton.factory = factory;