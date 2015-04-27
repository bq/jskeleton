'use strict';

/*globals Marionette, Jskeleton, _, Backbone */

/* jshint unused: false */

//## BaseApplication
//  BaseApplication Class that other Jskeleton.Applications can extend from.
//  It contains common application behavior as router/events initialization, application channels set up, common get methods...
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
    //Call to the specified view-controller method for render a app state
    invokeViewControllerRender: function(controllerView, args, handlerName) {
        var hook = this.getHook();
        this.triggerMethod('onNavigate', controllerView, hook);
        hook.processBefore();

        if (typeof controllerView[handlerName] !== 'function') {
            throw new Error('El metodo ' + handlerName + ' del view controller no existe');
        }

        controllerView[handlerName].call(controllerView, args, this.service);
        controllerView.render.call(controllerView);
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
    //Add application routes  to the router and event handlers to the global channel
    _initRoutes: function() {
        var self = this;
        this._viewControllers = [];
        if (this.routes) {
            _.each(this.routes, function(routeOptions, routeName) {
                routeOptions = routeOptions || {};
                //get view controller instance (it could be a view controller class asigned to the route or a default view controller if no class is specified)
                var viewController = self._getViewController(routeOptions);
                //add the route handler to Jskeleton.Router
                self._addAppRoute(routeName, routeOptions, viewController);
                //add the event handler to the app globalChannel
                self._addAppEventListener(routeName, routeOptions, viewController);
            });
        }
    },
    //
    _addAppRoute: function(routeString, routeOptions, viewController) {
        var self = this;

        this.router.route(routeString, {
            triggerEvent: routeOptions.triggerEvent,
            handlerName: routeOptions.handlerName || this._getViewControllerHandlerName(routeString)
        }, function(args, handlerName) {
            self.invokeViewControllerRender(viewController, args, handlerName);
        });
    },
    //Add listen to a global event changing the url with the event parameters and calling to the view-controller
    _addAppEventListener: function(routeString, routeOptions, viewController) {
        if (routeOptions.eventListener) {
            var self = this,
                handlerName = routeOptions.handlerName || this._getViewControllerHandlerName(routeString);

            this.listenTo(this.globalChannel, routeOptions.eventListener, function(args) {
                if (!routeOptions.navigate) {
                    //update the url
                    self._navigateTo.call(self, routeString, routeOptions, args);
                }

                self.invokeViewControllerRender(viewController, args, handlerName);
            });
        }
    },
    //Update the url with the specified parameters
    _navigateTo: function(routeString, routeOptions, params) {
        var triggerValue = routeOptions.triggerNavigate === true ? true : false,
            processedRoute = this.router._replaceRouteString(routeString, params);

        this.router.navigate(processedRoute, {
            trigger: triggerValue
        });
    },
    _getViewControllerHandlerName: function(routeString) {
        var handlerName = this.routes[routeString].handlerName || this.router._getHandlerNameFromRoute(routeString);

        if (!this.routes[routeString].handlerName) {
            //set the route handler name to the app route object
            this.routes[routeString].handlerName = handlerName;
        }

        return handlerName;
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