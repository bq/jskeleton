'use strict';

/*globals Marionette, Jskeleton, _, Backbone */

/* jshint unused: false */

//
//## BaseApplication
//  The BaseApplication is the container object where you split your webapp logic into 'pieces' as applications.
//  It initialize regions, events, routes, channels and child apps per application object.
//  A Jskeleton webapp can contains many Jskeleton.Applications as child apps of a unique Application 'main app'.
Jskeleton.BaseApplication = Marionette.Application.extend({
    //Default global webapp channel for communicate with other apps
    globalChannel: 'global',
    constructor: function(options) {
        options = options || {};

        //generate application id
        this.aid = this.getAppId();

        this.router = Jskeleton.Router.getSingleton();

        Marionette.Application.prototype.constructor.apply(this, arguments);
    },
    //Start method to listen routes and events and start subapps
    processNavigation: function(controllerView, args, handlerName) {
        var hook = this.getHook();
        this.triggerMethod('onNavigate', controllerView, hook);
        hook.processBefore();
        controllerView[handlerName].call(controllerView, args, this.service);
        hook.processAfter();
    },
    //Factory method to instance objects from Class references
    factory: function(Class, options) {
        options = options || {};
        options.parentApp = this;
        return new Class(options);
    },
    //Internal method to create an application private channel and set the global channel
    _initChannel: function() { //backbone.radio
        this.globalChannel = this.globalChannel ? Backbone.Radio.channel(this.globalChannel) : Backbone.Radio.channel('global');
        this.privateChannel = this.privateChannel ? Backbone.Radio.channel(this.privateChannel) : Backbone.Radio.channel(this.aid);
    },
    //Add application routes to the router
    _initAppRoutesListeners: function() {
        var self = this;
        this._viewControllers = [];
        if (this.routes) {
            _.each(this.routes, function(value, key) {
                self._addAppRoute(key, value);
            });
        }
    },
    //
    _addAppRoute: function(routeString, routeOptions) {
        var self = this,
            viewController;
        //get view controller instance (it could be a view controller class asigned to the route or a default view controller if no class is specified)
        viewController = this._getViewController(routeOptions);

        this.router.route(routeString, {
            triggerEvent: routeOptions.triggerEvent,
            handlerName: routeOptions.handlerName
        }, function() {
            self.processNavigation.apply(self, [viewController].concat(Array.prototype.slice.call(arguments)));
        });
    },
    //Get a view controller instance (if no view controller is specified, a default view controller class is instantiated)
    _getViewController: function(options) {
        var self = this,
            template = options.template,
            viewControllerOptions = _.extend({
                app: this,
                channel: this.privateChannel,
                service: this.service,
                region: this.region
            }, options.viewControllerOptions),
            ViewControllerClass = options.viewControllerClass || this.getDefaultviewController(),
            viewController;

        if (!template) {
            throw new Error('Tienes que definir un template');
        }

        ViewControllerClass = this.extendViewController(ViewControllerClass, template);

        viewController = this.factory(ViewControllerClass, viewControllerOptions);

        this._viewControllers.push(viewController);

        return viewController;
    },
    //Extend view controller class for inyect template dependency
    extendViewController: function(ViewControllerClass, template) {
        return ViewControllerClass.extend({
            template: template
        });
    },
    //
    _initAppEventsListeners: function() {
        var self = this;
        this._controllers = [];
        if (this.events) {
            _.each(this.events, function(value, key) {
                self._addAppEventListener(key, value);
            });
        }
    },
    //
    _addAppEventListener: function(eventName, eventOptions) {
        var controller = this._getViewController(eventOptions),
            self = this;

        this.globalChannel.on(eventName, function() {
            self.processNavigation(controller);
        });
    },
    //Get default application view-controller class if no controller is specified
    getDefaultviewController: function() {
        return Jskeleton.ViewController;
    },
    //Get default application layout class if no layoutClass is specified
    getDefaultLayoutClass: function() {
        return Marionette.LayoutView;
    },
    //Factory hook method
    getHook: function() {
        return new Jskeleton.Hook();
    },
    //Generate unique app id using underscore uniqueId method
    getAppId: function() {
        return _.uniqueId('a');
    }
});