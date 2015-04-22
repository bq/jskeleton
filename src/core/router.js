'use strict';
/*globals Jskeleton */
/* jshint unused: false */

var Router = Backbone.Router.extend({

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

    /**
     * A shorthand of app.router.route with the event name convention.
     * @memberof app.router
     * @example
     * routes names and its events names
     * user -> router:route:user
     * user/profile -> router:route:user:profile
     * user/:id -> router:route:user
     * user(/:id) -> router:route:user
     * @param {String} route   route name to listen
     * @param {Function} handler function to calls when route is satisfied
     */
    addRoute: function(route, handler) {
        route = route || '';

        console.log('router:add:before', route);

        // Unify routes regexp names
        var eventName = 'router:route:' + route.split('(')[0].split('/:')[0].split('/').join(':');

        console.log('router:add:after', eventName);

        this.route(route, eventName, handler);
    },

    /**
     * Router initialization.
     * Bypass all anchor links except those with data-bypass attribute
     * Starts router history. All routes should be already added
     * @memberof app.router
     */
    init: function() {
        console.log('router.after');

        console.log('router.Backbone.history.start');
        // Trigger the initial route and enable HTML5 History API support, set the
        // root folder to '/' by default.  Change in app.js.

        Backbone.history.start();

        // log.debug('router.location.hash', window.location.hash.replace('#/', '/'));
        // Backbone.history.navigate(window.location.hash.replace('#/', '/'), true);
    },
    start: function() {
        this.init();
    }
});


Router.getSingleton = function() {

    var instance = null;

    function getInstance() {
        if (!instance) {
            instance = new Router();
        }
        return instance;
    }

    Jskeleton.router = getInstance();
    return Jskeleton.router;
};


Router.start = function(app) {
    router.init();
};

Jskeleton.Router = Router;