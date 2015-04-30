'use strict';

/*globals Jskeleton, Backbone, _ */

/* jshint unused: false */


var paramsNames = /:\w(\_|\w|\d)*/g;

//optionalParam = /\((.*?)\)/g,
//namedParam = /(\(\?)?:\w+/g,
//splatParam = /\*\w+/;
//escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

//## Router
Jskeleton.Router = Backbone.Router.extend({
    routes: {},

    initialize: function() {
        this.listenTo(this, 'route', function() {
            var route = arguments[0];
            if (arguments[1] && arguments[1].length) {
                route += ':' + arguments[1].join(':');
            }
            console.log(route);
        });
    },

    route: function(routeString, options, callback) {
        options = options || {};

        //register route with the jskeleton implementation for view-controller and app-workflow
        if (options.viewControllerHandler === true) {
            var routeRegex,
                handlerName = options.handlerName && typeof options.handlerName === 'string' ? options.handlerName : this._getHandlerNameFromRoute(routeString),
                argsNames = this._getRouteParamsNames(routeString),
                name = options.name;

            if (!_.isRegExp(routeString)) {
                routeRegex = this._routeToRegExp(routeString);
            }

            if (!callback) {
                callback = this[name];
            }

            var router = this;

            Backbone.history.route(routeRegex, function(fragment) {
                var args = router._extractParametersAsObject(routeRegex, fragment, argsNames);
                if (router.execute(callback, args, handlerName) !== false) {
                    router.trigger.apply(router, ['route:' + name].concat(args));
                    router.trigger('route', name, args);
                    Backbone.history.trigger('route', router, name, args);
                }
            });

        } else {
            //register a route with the original Backbone.Router.route implementation
            Backbone.Router.prototype.route.apply(this, arguments);
        }

        return this;
    },

    //method to replace a route string with the specified params
    _replaceRouteString: function(routeString, params) {
        var self = this,
            splatPattern;

        _.each(params, function(value, key) {
            routeString = routeString.replace(/:(\w)+/, function(x) {
                //remove : character
                x = x.substr(1, x.length - 1);
                return params[x] ? Jskeleton.utils.replaceSpecialChars(String(params[x])) : '';
            });

            // find splats
            splatPattern = new RegExp("\\*" + key);
            routeString = routeString.replace(splatPattern, value);
        });

        //replace uncomplete conditionals ex. (:id) and coinditional parenthesis ()
        return routeString.replace(/\(([^\):])*:([^\):])*\)/g, '').replace(/\(|\)/g, '');
    },

    //Cast url string to a default camel case name (commonly to call view-controller method)
    //ex: '/show/details -> onShowDetails'
    _getHandlerNameFromRoute: function(routeString) {
        var endPosParams = routeString.indexOf(':') === -1 ? routeString.length : routeString.indexOf(':'),
            endPosOptionals = routeString.indexOf('(/') === -1 ? routeString.length : routeString.indexOf('(/'),
            endPosSplats = routeString.indexOf('*') === -1 ? routeString.length : routeString.indexOf('*');

        var replacedString = routeString.substr(0, Math.min(endPosParams, endPosOptionals, endPosSplats)).replace(/\/(\w|\d)?/g, function(x) {
                return x.replace(/\//g, '').toUpperCase();
            }),
            handlerName = 'on' + replacedString.charAt(0).toUpperCase() + replacedString.slice(1);

        return handlerName;
    },

    //Execute a route handler with the provided parameters.
    //Override Backbone.Router.exectue method to provide the
    //view controller handlerName based on routeString.
    execute: function(callback, args, handlerName) {
        if (callback) {
            callback.call(this, args, handlerName);
        }
    },

    //Execute a route handler with the provided parameters.
    //return parameters as object
    _extractParametersAsObject: function(route, fragment, argsNames) {
        var params = route.exec(fragment).slice(1),
            paramsObject = {};

        _.each(params, function(param, i) {
            if (i === params.length - 1) {
                param = param || null;
            } else {
                param = param ? decodeURIComponent(param) : null;
            }

            if (argsNames[i] !== undefined) {
                paramsObject[argsNames[i]] = param;
            }
        });

        return paramsObject;
    },

    //Extracts route params names as array.
    _getRouteParamsNames: function(routeString) {
        var name = paramsNames.exec(routeString),
            names = [];

        while (name !== null) {
            names.push(name[0].replace(':', ''));
            name = paramsNames.exec(routeString);
        }

        return names;
    },

    // Router initialization.
    // Bypass all anchor links except those with data-bypass attribute
    // Starts router history. All routes should be already added
    init: function() {
        // Trigger the initial route and enable HTML5 History API support, set the
        // root folder to '/' by default.  Change in app.js.
        Backbone.history.start();

        // log.debug('router.location.hash', window.location.hash.replace('#/', '/'));
        // Backbone.history.navigate(window.location.hash.replace('#/', '/'), true);
    },

    start: function() {
        this.init();
    }
}, {

    // Get singleton instance bject
    getSingleton: function() {

        var instance = null;

        function getInstance() {
            if (!instance) {
                instance = new Jskeleton.Router();
            }
            return instance;
        }

        Jskeleton.router = getInstance();
        return Jskeleton.router;
    },

    // Initialize Backbone.history.start
    start: function(app) {
        app.router.init();
    }
});
