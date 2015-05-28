'use strict';
/*globals Marionette, JSkeleton, _, Backbone */
/* jshint unused: false */

//Application object factory
var factory = {};

//Default available factory objects
factory.prototypes = {
    Model: {
        Class: Backbone.Model
    },
    Collection: {
        Class: Backbone.Collection
    }
};

//Available singletons objects
factory.singletons = {};

//Adds an object class to the factory
factory.add = function(key, ObjClass, ParentClass, deps) {

    if (this.prototypes[key]) {
        throw new Error('AlreadyDefinedFactoryObject - ' + key);
    }

    this.prototypes[key] = {
        Class: ObjClass
    };

    if (ParentClass) {
        this.prototypes[key].Parent = ParentClass;
    }

    if (deps) {
        this.prototypes[key].dependencies = deps;
    }
};

//Creates a new object.
//Can recieve an object class or a string object factory key.
//It resolves the object dependencies with the global dependency injector JSkeleton.di
factory.new = function(obj, options /* ,more constructor args */ ) {
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

    //resolve dependencies
    return JSkeleton.di.create.apply(JSkeleton.di, [FactoryObject, undefined].concat(Array.prototype.slice.call(arguments, 1)));
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

//Retrieves an Object reference
factory.getClass = function(obj) {

    if (!this.prototypes[obj]) {
        throw new Error('UndefinedFactoryObject - ' + obj);
    }

    return this.prototypes[obj].Class;
};

//Gets all objects added to the factory
factory.getAll = function() {
    return this.prototypes;
};

// empty factory prototypes
factory.empty = function() {
    this.prototypes = {
        Model: {
            Class: Backbone.Model
        },
        Collection: {
            Class: Backbone.Collection
        }
    };
};

JSkeleton.factory = factory;