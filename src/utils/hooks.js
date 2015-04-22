'use strict';
/*globals Jskeleton,_ */
/* jshint unused: false */

var Hook = Jskeleton.Hook = function() {
    this.beforeCallbacks = [];
    this.afterCallbacks = [];
    return this;
};


Hook.prototype.before = function(callback) {
    this.beforeCallbacks.push(callback);
    return this;
};

Hook.prototype.after = function(callback) {
    this.afterCallbacks.push(callback);
    return this;
};

Hook.prototype.processBefore = function() {
    var self = this;
    _.each(this.beforeCallbacks, function(callback) {
        callback.apply(self);
    });
    this.beforeCallbacks = [];
    return this;
};

Hook.prototype.processAfter = function() {
    var self = this;
    _.each(this.afterCallbacks, function(callback) {
        callback.apply(self);
    });
    this.afterCallbacks = [];
    return this;
};