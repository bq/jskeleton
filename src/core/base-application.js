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
    invokeViewControllerRender: function(routeObject, args, handlerName) {
        var hook = this.getHook(),
            viewController = routeObject._viewController = this._getViewControllerInstance(routeObject);

        this.triggerMethod('onNavigate', viewController, hook);
        hook.processBefore();

        if (typeof viewController[handlerName] !== 'function') {
            throw new Error('El metodo ' + handlerName + ' del view controller no existe');
        }

        viewController[handlerName].call(viewController, args, this.service);
        this._showControllerView(viewController);
        hook.processAfter();
    },
    _showControllerView: function(controllerView) {
        if (this.mainRegion && this.mainRegion.currentView !== controllerView) {
            this.mainRegion.show(controllerView);
        } else {
            controllerView.render();
        }
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
            _.each(this.routes, function(routeObject, routeName) {
                routeObject = routeObject || {};
                //get view controller instance (it could be a view controller class asigned to the route or a default view controller if no class is specified)
                //get view controller extended class with d.i
                routeObject._ViewController = self._extendViewControllerClass(routeObject);

                routeObject._viewControllerOptions = _.extend({
                    app: self,
                    channel: self.privateChannel,
                    service: self.service,
                    region: self.region
                }, routeObject.viewControllerOptions);

                //add the route handler to Jskeleton.Router
                self._addAppRoute(routeName, routeObject);
                //add the event handler to the app globalChannel
                self._addAppEventListener(routeName, routeObject);
            });
        }
    },
    //
    _addAppRoute: function(routeString, routeObject) {
        var self = this;

        this.router.route(routeString, {
            viewControllerHandler: true,
            triggerEvent: routeObject.triggerEvent,
            handlerName: routeObject.handlerName || this._getViewControllerHandlerName(routeString)
        }, function(args, handlerName) {
            self.invokeViewControllerRender(routeObject, args, handlerName);
        });
    },
    //Add listen to a global event changing the url with the event parameters and calling to the view-controller
    _addAppEventListener: function(routeString, routeObject) {
        if (routeObject.eventListener) {
            var self = this,
                handlerName = routeObject.handlerName || this._getViewControllerHandlerName(routeString);

            this.listenTo(this.globalChannel, routeObject.eventListener, function(args) {
                if (!routeObject.navigate) {
                    //update the url
                    self._navigateTo.call(self, routeString, routeObject, args);
                }

                self.invokeViewControllerRender(routeObject, args, handlerName);
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
    //Extend view controller class for inyect template dependency
    _extendViewControllerClass: function(options) {

        var template = options.template,
            ViewControllerClass = options.viewControllerClass || this.getDefaultviewController();

        if (!template) {
            throw new Error('Tienes que definir un template');
        }

        return ViewControllerClass.extend({
            template: template
        });

    },
    _removeViewController: function(routeObject, viewController) {
        if (routeObject._viewController === viewController) {
            routeObject._viewController = undefined;
        }
    },
    //Get a view controller instance (if no view controller is specified, a default view controller class is instantiated).
    //Ensure that don't extist a view-controller and if exist that it's not destroyed
    _getViewControllerInstance: function(routeObject) {
        var self = this,
            viewController = routeObject._viewController,
            ViewControllerClass = routeObject._ViewController,
            viewControllerOptions = routeObject._viewControllerOptions || {};

        if (!viewController || viewController.isDestroyed === true) {
            viewController = this.factory(ViewControllerClass, viewControllerOptions);
            this.listenTo(viewController, 'destroy', this._removeViewController.bind(this, routeObject, viewController));
        }
        // this._viewControllers.push(viewController);

        return viewController;
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