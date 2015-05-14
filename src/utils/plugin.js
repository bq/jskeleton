'use strict';

/*globals Jskeleton */

/* jshint unused: false */

Jskeleton.plugin = function(name, protoFunction) {
    return Jskeleton.factory.add(name, protoFunction);
};