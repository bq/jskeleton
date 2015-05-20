'use strict';

/* globals JSkeleton, Marionette, _ */

JSkeleton.Extension = Marionette.Object.extend({
    constructor: function() {
        this.extensions = {};
    },
    // Add extension to JSkeleton.
    //
    //
    //
    add: function(name, options, protoFunction) {

        var extension = this.extensions[name] = _.extend(options, {
            //Extension class function
            proto: protoFunction,
            //A resolved flag to indicate if the extension async is resolved
            resolved: options.async === true ? false : true,
            //The value returned by the async resolver function
            resolvedValue: undefined
        });

        if (extension.async === true && !extension.resolver) {
            throw new Error('You must to define a resolve function to resolve the async for ' + name + ' extension.');
        }

        if (options.factory !== false) {
            JSkeleton.factory.add(name, protoFunction);
        }

        if (options.initialize === true) {
            return this.wait(name);
        }
    },
    //
    //
    //
    wait: function(name, callback) {
        var self = this,
            extension = this.extensions[name];

        return new JSkeleton.Promise(function(promiseResolver) {

            if (extension.async === true && extension.resolved !== true) {
                var resolvedValue = extension.resolver();

                if (typeof resolvedValue.then === 'function') {
                    //the resolver function returns a promise, stored in resolverValue
                    extension.resolverValue.then(function(resolvedExtension) {
                        self._resolveResource(resolvedExtension, promiseResolver, callback);
                        extension.resolved = true;
                        extension.resolvedValue = resolvedExtension;
                    });
                } else {
                    //the resolver function returns a simple value
                    self._resolveResource(resolvedValue, promiseResolver, callback);
                    extension.resolved = true;
                    extension.resolvedValue = resolvedValue;
                }

            } else {
                self._resolveResource(extension.resolvedValue, promiseResolver, callback);
            }

        });

    },
    //
    //
    //
    _resolveResource: function(resource, promiseResolver, callback) {
        if (typeof promiseResolver === 'function') {
            promiseResolver(resource);
        }

        if (typeof callback === 'function') {
            callback(resource);

        }
    }
});