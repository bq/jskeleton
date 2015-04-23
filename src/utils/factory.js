'use strict';
/*globals Marionette, Jskeleton, _, Backbone */
/* jshint unused: false */

/**
 * Application object factory
 * @exports factory
 * @namespace
 * @memberof app
 */
var factory = {};

/**
 * Default available factory objects
 * @private
 * @type {Object}
 */
factory.prototypes = {
    Model: Backbone.Model,
    Collection: Backbone.Collection
};

/**
 * Available singletons objects
 * @private
 * @type {Object}
 */
factory.singletons = {};

/**
 * Adds an object to the factory
 * @param {String} key Name of the object to reference
 * @param {Object} obj
 */
factory.add = function(key, obj) {
    if (this.prototypes[key]) {
        throw new Error('AlreadyDefinedFactoryObject - ' + key);
    }
    this.prototypes[key] = obj;
};

/**
 * Creates a new object
 * @param  {String} obj         Name of the object to create
 * @param  {Object} [options]   Constructor params
 * @return {Object}             A new instance of the object reference
 */
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

/**
 * Creates a new object o retrieves the created one
 * @param  {String} obj         Name of the object to create
 * @param  {Object} [options]   Constructor params
 * @return {Object}               A new instance of the object reference
 */
factory.singleton = function(obj, options) {
    options = options || {};

    if (!this.singletons[obj]) {
        this.singletons[obj] = this.new(obj, options);
    }

    return this.singletons[obj];
};

/**
 * Retrieves an Object reference
 * @param  {String} obj Name of the object to get reference
 * @return {Object}     Reference to the original object in the factory
 */
factory.get = function(obj) {
    if (!this.prototypes[obj]) {
        throw new Error('UndefinedFactoryObject - ' + obj);
    }
    return this.prototypes[obj];
};

/**
 * Gets all object added to the factory
 * @return {Array} A lis of all objects added to the factory
 */
factory.getAll = function() {
    return this.prototypes;
};


Jskeleton.factory = factory;
