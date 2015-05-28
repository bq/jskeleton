'use strict';
/* globals JSkeleton */


/**
 * Module to manage Marionette behaviors
 * @exports behaviors
 * @namespace
 * @memberof app
 */
var behaviors = {

    /**
     * Defines a behaviors lookup namespace
     * @type {Object}
     */
    lookup: {},

    /**
     * Storages only defaults behaviors
     * @type {Object}
     */
    defaults: {}

};

/**
 * Adds a behavior
 * @param {Object} params
 * @param {String} params.name
 * @param {Marionette.Behavior} params.behaviorClass
 * @param {Object} params.isDefault
 */
behaviors.add = function(params) {
    if (params.isDefault) {
        this.defaults[params.name] = {};
    }
    this.lookup[params.name] = params.behaviorClass;
};

/**
 * Gets a specific behavior
 * @param  {Object} params
 * @param  {String} params.name
 * @param  {Object} params.options  Behavior options
 * @return {Object} Behavior config for Marionette.View.behaviors function
 */
behaviors.get = function(params) {

    if (behaviors.lookup[params.name]) {
        var behavior = {};
        behavior[params.name] = params.options || {};
        return behavior;
    }
    throw new Error('behaviors:behavior:undefined');
};

/**
 * Gets defaults behaviors
 * @param  {Object} options  Behavior options
 * @return {Object} Behavior config for Marionette.View.behaviors function
 */
behaviors.getDefaults = function(options) {
    return _.extend(_.clone(this.defaults), options);
};

// Tell Marionette where to lookup for behaviors
Marionette.Behaviors.behaviorsLookup = function() {
    return behaviors.lookup;
};


JSkeleton.behaviors = behaviors;
