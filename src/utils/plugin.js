'use strict';
/*globals Marionette, Jskeleton, _, Backbone */
/* jshint unused: false */

var plugin  = function(name, protoFunction){
    return Jskeleton.factory.add(name, protoFunction);
};

Jskeleton.plugin = plugin;
