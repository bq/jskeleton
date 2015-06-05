'use strict';

/*globals Marionette, JSkeleton, _, Backbone */

/* jshint unused: false */

//## Application
//  Application class is a 'container' where to store your webapp logic and split it into small 'pieces' and 'components'.
//  It initializes `regions, events, routes, channels and child applications`.
//  It has a global channel to communicate with others apps and a private channel to communicate with it's components,
//  A JSkeleton webapp can contain many JSkeleton.Applications.
//  A `JSkeleton.Application` can define multiple child applications (`JSkeleton.ChildApplication`).
JSkeleton.Application = Marionette.Application.extend({
    //Default el dom reference if no `el` it's specified
    defaultEl: 'body',
    waitBeforeStartHooks: true,
    startWithParent: true,
    filterStack: [],
    middlewareStack: [],
    constructor: function(options) {

        options = options || {};

        this.parentApplication = options.parentApplication;

        this._childApplications = {};

        if (!this.parentApplication) {
            this.el = options.el || this.el || this.defaultEl;
        }

        this._region = options.region;

        this.di = new JSkeleton.Di({
            globalDi: JSkeleton.di
        });

        //add routeFilters middlewares to app workflow
        if (this.routeFilters) {
            this._use('routeFilters', this.routeFilters);
        }

        //add middlewares to app workflow
        if (this.middlewares) {
            this._use('middlewares', this.middlewares);
        }

        // if (this.middlewares) {
        this._beforeStartHooks = _.clone(this.beforeStartHooks);
        // }

        //generate application id
        this.aid = this._getAppId();

        this.router = new JSkeleton.Router();

        //application scope to share common data inside the application
        this.scope = {};

        Marionette.Application.prototype.constructor.apply(this, arguments);

        this._addApplicationDependencies();

        return this;

    },
    //Method to start the application, start the `ChildApplications` and start listening routes/events.
    //This method will wait until the beforeStartHooks defined in the application will be completed (with a promise).
    //If an option waitBeforeStartHooks it's set to false, the application won't wait hooks before start.
    start: function(options) {

        // this.renderInitialState();s

        //Wait for all the JSkeleton.extensions
        if (this.waitBeforeStartHooks && !this.parentApplication) {

            this.triggerMethod('before:extension:start', options);

            var self = this;

            this._waitBeforeStartHooks().then(function() {

                self.triggerMethod('extension:start', options);

                self._startApplication(options);
            });

        } else {
            this._startApplication(options);
        }

    },

    //Method to start listening the `Backbone.Router`
    //Only a `JSkeleton.Application' can start a `JSkeleton.Router` instance.
    //The JSkeleton.Router is created by the `JSkeleton.Application` objects and injected to the `JSkeleton.ChildApplication`.
    startRouter: function() {
        // if (!this.parentApplication) {
        JSkeleton.Router.start();
        // }
    },

    _startApplication: function(options) {

        //trigger before:start event and call to onBeforeStart method if it's defined in the application object
        this.triggerMethod('before:start', options);

        // Create a layout for the application if a viewController its defined
        this._createApplicationLayout();

        //initialize and start child applications defined in the application object
        this._initChildApplications(options);

        this._started = true;

        this._initCallbacks.run(options, this);

        //Add routes listeners to the JSkeleton.router
        this._initRoutes(options);

        //Add app proxy events
        // this._proxyEvents(options);

        //Start the `JSkeleton.Router` to listen to Backbone.History and to listen to the global channel events
        this.startRouter();

        //trigger start event and call to onStart method if it's defined in the application object
        this.triggerMethod('start', options);

    },

    //Method to wait for all before start hooks defined inside the application object and inside `JSkeleton` namespace.
    // The beforeStartHooks have to be an array with methods that return promises.
    // These promises will be the wait condition.
    _waitBeforeStartHooks: function() {

        //get the beforeStart application Hooks and ensure that the Hooks are an array
        var beforeStartHooks = _.isArray(this._beforeStartHooks) ? this._beforeStartHooks : [this._beforeStartHooks],
            //get the beforeStart JSkeleton global Hooks and ensure that the Hooks are an array
            lookUpHooks = _.isArray(JSkeleton.beforeStartHooks) ? JSkeleton.beforeStartHooks : [JSkeleton.beforeStartHooks],
            //Concat the hooks to iterate over them
            hooks = lookUpHooks.concat(beforeStartHooks),
            self = this,
            promises = [];

        _.each(hooks, function(fnHook) {
            if (typeof fnHook === 'function') {
                promises.push(fnHook.call(self));
            }
        });

        return JSkeleton.Promise.all(promises);
    },

    //Private method to initialize the application regions
    _initializeRegions: function() {
        //ensure initial root DOM reference is available
        this._ensureEl();

        Marionette.Application.prototype._initializeRegions.apply(this, arguments);

        // Create root region on root DOM reference
        if (!this.parentApplication) {
            this._createMainRegion();
        }
    },

    //Private method to ensure that the application has a dom reference where create the main application region
    _ensureEl: function() {
        if (!this.$el && !this.parentApplication) {
            if (!this.el) {

                throw new Error('It is necessary to define a \'el\' for Main App');
            }
            this.$el = $(this.el);
        }
    },

    //Add the root region to the main application
    _createMainRegion: function() {

        if (!(this._region instanceof JSkeleton.Region)) {
            //create a new `JSkeleton.Region`
            this._region = this._regionManager.addRegion('main', this.$el);
        }
    },

    //Create a layout for the Application to have more regions availables.
    //The application expose the layout regions to the application object as own properties.
    _createApplicationLayout: function() {
        var layout = this.layout;

        //ensure viewController object is defined
        if (layout) {
            //get layout class
            var LayoutClass = typeof layout === 'object' && layout.layoutClass ? layout.layoutClass : layout,
                //get the layout options that will be passed to the layout constructor
                layoutOptions = typeof layout === 'object' && layout.layoutOptions ? layout.layoutOptions : {},
                //extend viewController template
                layoutExtendTemplate = typeof layout === 'object' && layout.template ? {
                    template: layout.template
                } : undefined;

            //create the layout instance if it isn't rendered yet
            if (!this._layout || !this._layout instanceof LayoutClass) {
                this._layout = this.getInstance(LayoutClass, layoutExtendTemplate, layoutOptions);

                //Show the layout in the application main region
                this.main.show(this._layout);

                //expose the view-controller regions to the application object
                this._addLayoutRegions();
            }
        }
    },

    //Expose view-controller regions to the application namespace
    _addLayoutRegions: function() {
        var self = this;
        if (this._layout.regionManager.length > 0) {
            _.each(this._layout.regionManager._regions, function(region, regionName) {
                self[regionName] = region;
            });
        }
    },

    //Iterate over child applications to start each one
    _initChildApplications: function() {
        if (!this.isChildApp) {

            var self = this;

            _.each(this.applications, function(appOptions, appName) {
                appOptions.parentApplication = self;
                self._initChildApplication(appName, appOptions);
            });

            //trigger onApplicationsStart event when all the `JSkeleton.ChildApplication` are started and before the application router it's started
            this.triggerMethod('applications:start');
        }
    },

    //Start child application with it's dependencies injected
    _initChildApplication: function(appName, appOptions) {
        appOptions = appOptions || {};

        //get application class definition (could be either a factory key string or an application class)
        var appClass = appOptions.applicationClass, //DI: this.getClass(appOptions.applicationClass)
            startWithParent = appOptions.startWithParent !== undefined ? appOptions.startWithParent : true;

        //Get the region where the `JSkeleton.ChildApplication` logic the `JSkeleton.ChildApplication` layout and the `JSkeleton.ChildApplication` view-controllers will be 'rendered'.
        //It would be the main application region by default, but if a layout it's defined for the Application object, a different region must be defined.
        appOptions.region = this._getChildAppRegion(appOptions);

        //Ommit instanciate config options
        var instanceOptions = _.omit(appOptions, 'applicationClass', 'startWithParent');
        //Instance the `JSkeleton.ChildApplication` class with the `JSkeleton.ChildApplication` options specified
        var instance = this.getInstance(appClass, {}, instanceOptions); //DI: resolve dependencies with the injector (using the factory object maybe)

        //expose the child application instance
        this._childApplications[appName] = instance;

        //Start child application
        if (startWithParent === true) {
            this.startChildApplication(instance, instanceOptions.startOptions);
        }
    },

    //Get the region where a `JSkeleton.ChildApplication` will be rendered when process a route or an event
    _getChildAppRegion: function(appOptions) {
        var region,
            regionName = appOptions.region || this.mainRegionName;

        //retrieve the region from the application layout (if it exists)
        if (this._layout && this._layout.regionManager) {
            region = this._layout.regionManager.get(regionName);
        }

        //if the region isn`t in the application layout, retrieve the region from the application region manager defined as application region
        if (!region) {
            region = this._regionManager.get(regionName);
        }

        //the region must exists
        if (!region) {
            throw new Error('The region must exist in the Application.');
        }

        return region;
    },

    //Method to explicit start a child app instance
    startChildApplication: function(childApp, options) {
        childApp.start(options);
    },

    //Get child app instance by name
    getChildApplication: function(appName) {
        return this._childApplications[appName];
    },
    stop: function(options) {
        this.stopListening();
    },
    //Call to the specified view-controller method for render a app state
    invokeViewControllerRender: function(routeObject, args, handlerName) {
        // var hook = this.getHook(),
        //Get the view controller instance
        var viewController = routeObject._viewController = this._getViewControllerInstance(routeObject);

        this.triggerMethod('onNavigate', viewController);

        this._showViewController(viewController, handlerName, args);
    },
    //Factory method to instance objects from Class references or from factory key strings
    getInstance: function(Class, extendProperties, options) {
        options = options || {};
        options.parentApp = this;

        return this.di.create(Class, extendProperties, options);
    },
    destroy: function(options) {
        this.removeRegions();
    },
    removeRegions: function() {
        //TODO
    },
    getDefaultviewController: function() {},
    //Get default application layout class if no layoutClass is specified
    getDefaultLayoutClass: function() {
        return Marionette.LayoutView;
    },
    //Factory hook method
    getHook: function() {
        return new JSkeleton.Hook();
    },
    //Generate unique app id using underscore uniqueId method
    _getAppId: function() {
        return _.uniqueId('a');
    },
    _addApplicationDependencies: function() {

        this.di.inject({
            _privateChannel: this.privateChannel,
            _globalChannel: this.globalChannel,
            _app: this,
            _scope: this.scope
        });

    },
    //Show the controller view instance in the application region
    _showViewController: function(viewController, handlerName, args) {

        if (this._region && this._region.currentView !== viewController) {

            this._region.show(viewController, {
                renderOptions: args
            });

        } else {
            // view already rendered, update view
            if (this._region) {
                viewController.refresh({
                    renderOptions: args
                });
            }
        }
    },
    //Add application routes  to the router and event handlers to the global channel
    _initRoutes: function() {

        var self = this;

        this.router.addApplicationRoutes(this.routes);

        this.listenTo(this.router, 'navigate', function(opts) {
            self._processNavigation(opts.routeString, opts.routeObject, opts.params /*, handlerName, args*/ );
        });

    },
    //Process a navigation (either event or route navigation).
    //Check if the navigation should be completed (if all the filters success).
    //Also call to the declared middlewares before navigate.
    _processNavigation: function(routeString, routeObject, args, handlerName) {

        if (this._routeFilterProcessing(routeString, routeObject, args)) {

            //middlewares processing before navigation
            this._middlewaresProcessing(routeString, routeObject, args);

            //check if the navigate option is set to false to prevent from change the navigation url
            if (routeObject.navigate !== false) {
                //update the url
                this._navigateTo.call(this, routeString, routeObject, args);
            }

            this.invokeViewControllerRender(routeObject, args, handlerName || 'processContext');
        }

    },
    //Update the url with the specified parameters.
    //If triggerNavigate option is set to true, the route callback will be fired adding an entry to the history.
    _navigateTo: function(routeString, routeOptions, params) {

        var triggerValue = routeOptions.triggerNavigate === true ? true : false,
            processedRoute = this.router._replaceRouteString(routeString, params);

        this.router.navigate(processedRoute, {
            trigger: triggerValue
        });

    },
    //RouteFilters Middlewares handlers processor
    _routeFilterProcessing: function(routeString, routeOptions, params) {
        var self = this,
            filterError = false,
            err = null,
            result,
            _routeParams = {
                routeString: routeString,
                routeOptions: routeOptions,
                params: params
            };

        var mainStack = (this.parentApp) ? this.parentApp.filterStack : this.filterStack;

        if (mainStack.length !== 0) {
            for (var i = 0; i < mainStack.length; i++) {
                result = mainStack[i].call(self, _routeParams);
                if (typeof result !== true && typeof result !== 'undefined') {
                    filterError = true;
                    err = result;
                    break;
                }
            }
        }

        if (filterError === false) {
            return true;
        } else {
            this.parentApp ? this.parentApp.triggerMethod('filter:error', err, _routeParams) : this.triggerMethod('filter:error', err, _routeParams); //jshint ignore:line
        }
    },
    //Middlewares handlers processing
    _middlewaresProcessing: function(routeString, routeOptions, params) {
        var self = this,
            _routeParams = {
                routeString: routeString,
                routeOptions: routeOptions,
                params: params
            };

        var mainStack = (this.parentApp) ? this.parentApp.middlewareStack : this.middlewareStack;

        if (mainStack.length !== 0) {
            for (var i = 0; i < mainStack.length; i++) {
                mainStack[i].call(self, _routeParams);
            }
        }
    },
    _use: function(type, fn) {
        var offset = 1;
        var fns = _.flatten(Array.prototype.slice.call(arguments, offset));

        if (fns.length === 0) {
            throw new TypeError('Application.use() requires functions');
        }
        //evaluate type of middlewares and push to their stack
        if (type === 'routeFilters') {
            this.filterStack = _.union(this.filterStack, fns);
        } else if (type === 'middlewares') {
            this.middlewareStack = _.union(this.middlewareStack, fns);
        }
    },
    // Get a view controller instance (if no view controller is specified, a default view controller class is instantiated).
    //Ensure that don't extist a view-controller and if exist that it's not destroyed.
    //The view controller is instantiated using the `JSkeleton.Di` to resolve the view-controller dependencies.
    _getViewControllerInstance: function(routeObject) {
        var self = this,
            //get the view-controller instance (if it exists)
            viewController = routeObject._viewController,
            //get the view-controller class
            ViewControllerClass = routeObject.viewControllerClass,
            //get the view-controller options
            viewControllerOptions = routeObject._viewControllerOptions || {};

        //get the view-controller template
        var viewControllerExtendTemplate = routeObject.template ? {
            template: routeObject.template
        } : undefined;

        if (!viewController || viewController.isDestroyed === true) {
            viewController = this.getInstance(ViewControllerClass, viewControllerExtendTemplate, viewControllerOptions);
            this.listenTo(viewController, 'destroy', this._removeViewController.bind(this, routeObject, viewController));
        }

        return viewController;
    },
    //Get the application view-controller class.
    //Retrieve a default view controller class if no controller is specified in the options.
    //If a key string is specified as view-controller, a factory object is retrieved `{Class: ClassReference, Parent: ParentClassReference}`
    _getViewControllerClass: function(options) {
        var ViewController;

        //the view controller class is a factory key string
        if (typeof options.viewControllerClass === 'string') {
            ViewController = JSkeleton.factory.get(options.viewControllerClass);
        } else {
            //the view controller class is a class reference
            //If no view controller class is specified, a default JSkeleton.ViewController is retrieved
            ViewController = options.viewControllerClass || JSkeleton.ViewController;
        }

        return ViewController;
    },
    _removeViewController: function(routeObject, viewController) {
        if (routeObject._viewController === viewController) {
            routeObject._viewController = undefined;
        }
    },
    //Attach application events to the global channel (triggers and listeners)
    _proxyEvents: function(options) {
        options = options || {};
        var events = options.events || this.events || {};

        this._proxyTriggerEvents(events.triggers);
        this._proxyListenEvents(events.listen);
    },
    //Attach trigger events:
    //Propagate internal events (application channel) into the global channel
    _proxyTriggerEvents: function(triggerArray) {
        var self = this;
        //Check if triggers are defined
        if (triggerArray && typeof triggerArray === 'object') {
            _.each(triggerArray, function(eventName) {
                //Listen to the event in the private channel
                self.listenTo(self.privateChannel, eventName, function() {
                    var args;
                    //if the event type is 'all', the first argument is the name of the event
                    if (eventName === 'all') {
                        eventName = arguments[0];
                        //casting arguments array-like object to array with excluding the eventName argument
                        args = [eventName].concat(Array.prototype.slice.call(arguments, 1));
                    } else {
                        //casting arguments array-like object to array
                        args = Array.prototype.slice.call(arguments);
                    }

                    //trigger the event throw the globalChannel
                    self.globalChannel.trigger.apply(self.globalChannel, [eventName].concat(args));
                });
            });

        }
    },
    //Attach Global events to the private channel:
    //Propagate external events (global channel) into the private channel
    _proxyListenEvents: function(listenObject) {
        var self = this;
        if (listenObject && typeof listenObject === 'object') {
            _.each(listenObject, function(eventName) {
                //Listen to that event in the global channel
                self.listenTo(self.globalChannel, eventName, function() {
                    var args;

                    //if the event is 'all' the first argument is the name of the event
                    if (eventName === 'all') {
                        eventName = arguments[0];
                        //casting arguments array-like object to array with excluding the eventName argument
                        args = [eventName].concat(Array.prototype.slice.call(arguments, 1));
                    } else {
                        //casting arguments array-like object to array
                        args = Array.prototype.slice.call(arguments);
                    }

                    //trigger the event throw the globalChannel
                    self.privateChannel.trigger.apply(self.privateChannel, [eventName].concat(args));
                });
            });
        }
    }
}, {
    factory: JSkeleton.Utils.FactoryAdd
});