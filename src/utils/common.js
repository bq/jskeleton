'use strict';

/* globals _, JSkeleton */

// Application global config and params
var common = JSkeleton.common = {
    config: {
        mode: undefined,
        version: '0.0.1',
        // application name
        appName: 'jskeleton-app',
        // Client type
        clientType: 'WEB',
        // WebApp root URL
        wwwRoot: window.location.protocol + '//' + window.location.host + window.location.pathname,
        //Default lang
        lang: 'es-ES'
    }
};

// Returns all application config params
common.getConfig = function() {
    return this.config;
};

// Overrides current config with params object config
common.setConfig = function(config) {

    _.extend(this.config, config);

    return this;
};


// Gets a specific config param
common.get = function(field) {
    if (this.config[field] === undefined) {
        throw new Error('UndefinedCommonField "' + field + '"');
    }
    return this.config[field];
};

// Gets a specific config param or default
common.getOrDefault = function(field, defaultValue) {
    return this.config[field] || defaultValue;
};

// Sets a new value for specific config param
common.set = function(field, value) {
    this.config[field] = value;
};