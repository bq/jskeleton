'use strict';

/*globals JSkeleton */

/* jshint unused: false */

JSkeleton.plugin = function(name, protoFunction) {
    return JSkeleton.factory.add(name, protoFunction);
};