'use strict';

/* globals JSkeleton, Marionette, _ */

JSkeleton.Extension = Marionette.Object.extend({
    constructor: function() {
        this.extensions = {};
        this.promises = [];
    },
    // Add extension to JSkeleton.
    //
    //
    //
    add: function(name, options) {
        options = options || {};

        var extension = this.extensions[name] = _.extend(options, {
            //Extension class function
            proto: options.extensionClass,
            //A resolved flag to indicate if the extension asynchronous is resolved.
            resolved: options.async === true ? false : true,
            //The value returned by the async resolver function
            resolvedValue: undefined,
            //A promise to resolve the async. It has to be resolved when the extension be ready for use it.
            promise: options.promise
        });

        if (options.async === true && !options.promise instanceof Promise) {
            throw new Error('If the extension is asynchronous you have to provide a promise to resolve the async.');
        }

        //If the extension factory flag is set to true and has a function class, add the extension class to the `JSkeleton.factory`
        if (options.factory !== false && typeof options.extensionClass === 'function') {
            JSkeleton.factory.add(name, options.extensionClass);
        }

        if (options.async === true) {
            this.promises.push(options.promise);
            //if an option beforeStartHook it's set to true, add a beforeStartHook to JSKeleton namespace that will be processed when a `JSkeleton.Application` starts
            if (options.beforeStartHook === true) {

                JSkeleton.Utils.addBeforeStartHook(JSkeleton, function() {
                    return options.promise;
                });

            }
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
    waitAll: function() {
        var numPromises = this.promises.length;

        return new JSkeleton.Promise(function(resolve) {

            if (numPromises === 0) {
                resolve();
            }

            JSkeleton.Promise.all(this.promises).then(function() {
                resolve();
            });

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