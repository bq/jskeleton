(function(root, factory) {
    'use strict';
    /*globals require,define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['jquery',
            'underscore',
            'backbone',
            'backbone.marionette'
        ], function($, _, Backbone, Marionette) {
            return factory.call(root, root, $, _, Backbone, Marionette);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

        Backbone.$ = $;

        var Marionette = require('backbone.marionette'),
            Jskeleton = factory(root, $, _, Backbone, Marionette);

        var Handlebars = require('Handlebars');

        module.exports = Jskeleton;
    } else if (root !== undefined) {
        root.Jskeleton = factory.call(root, root, root.$, root._, root.Backbone, root.Marionette);
    }

})(this, function(root, $, _, Backbone, Marionette) {
    'use strict';

    /* jshint unused: false */


    var Jskeleton = root.Jskeleton || {};

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
                    return params[x] ? Jskeleton.Utils.replaceSpecialChars(String(params[x])) : '';
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
    'use strict';
    /*globals Marionette, Jskeleton, _ */
    /* jshint unused: false */
    
    /**
     * Reusable component as a Service
     */
    Jskeleton.Service = Marionette.Object.extend({
        constructor: function(opts) {
            var options = opts || {},
                // Todo serviceOptions ?
                serviceOptions = ['model', 'collection', 'events'];
    
            _.extend(this, _.pick(options, serviceOptions));
    
            this.options = _.extend({}, this.options, this.defaults, options);
    
            if (_.isFunction(this.initialize)) {
                this.initialize.apply(this, arguments);
            }
        }
    
    }, {
        factory: Jskeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, Jskeleton, _, Backbone */
    
    /* jshint unused: false */
    
    //## BaseApplication
    //  BaseApplication Class that other `Jskeleton.Applications` can extend from.
    //  It contains common application behavior as router/events initialization, application channels set up, common get methods...
    Jskeleton.BaseApplication = Marionette.Application.extend({
        //Default global webapp channel for communicate with other apps
        globalChannel: 'global',
        constructor: function(options) {
            options = options || {};
    
            this.di = new Jskeleton.Di({
                globalDi: Jskeleton.di
            });
    
            //generate application id
            this.aid = this.getAppId();
    
            this.router = Jskeleton.Router.getSingleton();
    
            this.scope = {};
    
            Marionette.Application.prototype.constructor.apply(this, arguments);
    
            this._addApplicationDependencies();
        },
        _addApplicationDependencies: function() {
    
            this.di.inject({
                _channel: this.privateChannel,
                _app: this,
                _scope: this.scope
            });
    
        },
        //Call to the specified view-controller method for render a app state
        invokeViewControllerRender: function(routeObject, args, handlerName) {
            // var hook = this.getHook(),
            //Get the view controller instance
            var viewController = routeObject._viewController = this._getViewControllerInstance(routeObject);
    
            this.triggerMethod('onNavigate', viewController);
            // hook.processBefore();
    
            if (typeof viewController[handlerName] !== 'function') {
                throw new Error('El metodo ' + handlerName + ' del view controller no existe');
            }
    
            viewController[handlerName].call(viewController, args, this.service);
            this._showControllerView(viewController);
            // hook.processAfter();
        },
        //Show the controller view instance in the application region
        _showControllerView: function(controllerView) {
            if (this.mainRegion && this.mainRegion.currentView !== controllerView) {
                this.mainRegion.show(controllerView);
            } else {
                controllerView.render();
            }
        },
        //Factory method to instance objects from Class references or from factory key strings
        factory: function(Class, extendProperties, options) {
            options = options || {};
            options.parentApp = this;
    
            if (typeof Class === 'string') {
                Class = Jskeleton.factory.get(Class);
            }
    
            return this.di.create(Class, extendProperties, options);
        },
        //Internal method to create an application private channel and set the global channel
        _initChannel: function() {
            //backbone.radio
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
                    //get view controller class object (it could be a view controller class asigned to the route or a default view controller if no class is specified)
                    routeObject._ViewController = self._getViewControllerClass(routeObject);
    
                    //extend view controller class with d.i
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
        //Internal method to retrieve the name of the view-controller method to call before render the view
        _getViewControllerHandlerName: function(routeString) {
            var handlerName = this.routes[routeString].handlerName || this.router._getHandlerNameFromRoute(routeString);
    
            if (!this.routes[routeString].handlerName) {
                //set the route handler name to the app route object
                this.routes[routeString].handlerName = handlerName;
            }
    
            return handlerName;
        },
        //Extend view controller class for inyect template dependency
        // _extendViewControllerClass: function(options) {
    
        //     var template = options.template,
        //         ViewControllerClass = this._getViewControllerClass(options);
    
        //     if (!template) {
        //         throw new Error('You have to define a template to the view-controller.');
        //     }
        //     //is a factory object
        //     if (ViewControllerClass.Class) {
        //         //extend the class inside stored in the factory object to add the template dependency.
        //         ViewControllerClass.Class = ViewControllerClass.Class.extend({
        //             template: template
        //         });
        //     } else {
        //         //Add the template to the View-Controller class
        //         ViewControllerClass = ViewControllerClass.extend({
        //             template: template
        //         });
        //     }
    
        //     return ViewControllerClass;
    
        // },
        // //Get a view controller instance (if no view controller is specified, a default view controller class is instantiated).
        //Ensure that don't extist a view-controller and if exist that it's not destroyed.
        //The view controller is instantiated using the `Jskeleton.Di` to resolve the view-controller dependencies.
        _getViewControllerInstance: function(routeObject) {
            var self = this,
                //get the view-controller instance (if it exists)
                viewController = routeObject._viewController,
                //get the view-controller class
                ViewControllerClass = routeObject._ViewController,
                //get the view-controller options
                viewControllerOptions = routeObject._viewControllerOptions || {},
    
                viewControllerExtendProperties = routeObject.template ? {
                    template: routeObject.template
                } : undefined;
    
    
            if (!viewController || viewController.isDestroyed === true) {
                viewController = this.factory(ViewControllerClass, viewControllerExtendProperties, viewControllerOptions);
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
                ViewController = Jskeleton.factory.get(options.viewControllerClass);
            } else {
                //the view controller class is a class reference
                ViewController = options.viewControllerClass || Jskeleton.ViewController;
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
        },
        start: function(options) {
            options = options || {};
    
            this._started = true;
    
            this._initCallbacks.run(options, this);
    
            //Add routes listeners to the Jskeleton.router
            this._initRoutes(options);
    
            //Add app proxy events
            this._proxyEvents(options);
        },
        stop: function(options) {
            this.stopListening();
        },
        destroy: function(options) {
            this.removeRegions();
        },
        //Remove all regions from the application
        removeRegions: function() {
            // var self = this;
            // this._regionManager.each(function(region) {
            //     self.removeRegion(region);
            // });
        },
        getDefaultviewController: function() {},
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
    }, {
        factory: Jskeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, Jskeleton, _, Backbone */
    
    /* jshint unused: false */
    
    
    //## Application
    //  Application class is a 'container' where to store your webapp logic and split it into small 'pieces' and 'components'.
    //  It initializes `regions, events, routes, channels and child applications`.
    //  It has a global channel to communicate with others apps and a private channel to communicate with it's components,
    //  A Jskeleton webapp can contain many Jskeleton.Applications.
    //  A `Jskeleton.Application` can define multiple child applications (`Jskeleton.ChildApplication`).
    Jskeleton.Application = Jskeleton.BaseApplication.extend({
        //Default el dom reference if no `el` it's specified
        defaultEl: 'body',
        //Main region name. Will be 'main' by default
        mainRegionName: 'main',
        constructor: function(options) {
    
            options = options || {};
    
            this.el = options.el || this.el || this.defaultEl;
    
    
            this._region = options.region || this.mainRegionName;
    
            //`Jskeleton.BaseApplication` constructor
            Jskeleton.BaseApplication.prototype.constructor.apply(this, arguments);
    
            this.applications = options.applications || this.applications || {};
    
            //private object instances of applications
            this._childApps = {};
    
            return this;
    
        },
        //Method to start the application, start the `ChildApplications` and start listening routes/events
        start: function(options) {
            //trigger before:start event and call to onBeforeStart method if it's defined in the application object
            this.triggerMethod('before:start', options);
            //initialize and start child applications defined in the application object
            this._initChildApplications(options);
    
            Jskeleton.BaseApplication.prototype.start.apply(this, arguments);
    
            //Start the `Jskeleton.Router` to listen to Backbone.History and to listen to the global channel events
            this.startRouter();
    
            //trigger start event and call to onStart method if it's defined in the application object
            this.triggerMethod('start', options);
        },
        //Method to start listening the `Backbone.Router`
        //Only a `Jskeleton.Application' can start a `Jskeleton.Router` instance.
        //The Jskeleton.Router is created by the `Jskeleton.Application` objects and injected to the `Jskeleton.ChildApplication`.
        startRouter: function() {
            this.router.start();
        },
        //Private method to initialize the application regions
        _initializeRegions: function() {
            //ensure initial root DOM reference is available
            this._ensureEl();
    
            Marionette.Application.prototype._initializeRegions.apply(this, arguments);
    
            // Create root region on root DOM reference
            this._createMainRegion();
            // Create a layout for the application if a layoutView its defined
            this._createApplicationLayout();
        },
        //Private method to ensure that the main application has a dom reference where create the root webapp region
        _ensureEl: function() {
            if (!this.$el) {
                if (!this.el) {
                    throw new Error('Tienes que definir una el para la Main App');
                }
                this.$el = $(this.el);
            }
        },
        //Add the root region to the main application
        _createMainRegion: function() {
    
            if (this._region instanceof Marionette.Region) {
                //TODO
            } else {
                //create a new `Jskeleton.Region`
                var mainRegion = {};
    
                mainRegion[this._region] = this.el;
    
                this.addRegions(mainRegion);
            }
        },
        //Create a layout for the Application to have more regions availables.
        //The application expose the layout regions to the application object as own properties.
        _createApplicationLayout: function() {
            //ensure layout object is defined
            if (this.layout && typeof this.layout === 'object') {
                //get defined layout template
                this.layoutTemplate = this.layout.template;
    
    
                this.layoutClass = this.layout.layoutClass || this.getDefaultLayoutClass(); //TODO: mirar si poner layout por defecto ( seria necesario entonces poder poner regiones de forma explicita)
    
                if (!this.layoutTemplate && this.layoutClass.template === undefined) {
                    throw new Error('You have to define a template for the application layout.');
                }
    
                if (this.layoutTemplate) {
                    //Extend the layout class to add the specified template
                    this.layoutClass = this.layoutClass.extend({
                        template: this.layoutTemplate
                    });
                }
    
                //create the layout instance with the layout options declared in the application layout object
                this._layout = this.factory(this.layoutClass, undefined, this.layout.options);
    
                //Show the layout in the application main region
                this[this.mainRegionName].show(this._layout);
    
                //expose the layout regions to the application object
                this._addLayoutRegions();
            }
        },
        //Expose layout regions to the application namespace
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
                    self._initChildApplication(appName, appOptions);
                });
    
                //trigger onApplicationsStart event when all the `Jskeleton.ChildApplication` are started and before the application router it's started
                this.triggerMethod('applications:start');
            }
        },
        //Start child application with it's dependencies injected
        _initChildApplication: function(appName, appOptions) {
            appOptions = appOptions || {};
            //get application class definition (could be either a factory key string or an application class)
            var appClass = appOptions.applicationClass, //DI: this.getClass(appOptions.applicationClass)
                startWithParent = appOptions.startWithParent !== undefined ? appOptions.startWithParent : true;
    
            //Get the region where the `Jskeleton.ChildApplication` logic the `Jskeleton.ChildApplication` layout and the `Jskeleton.ChildApplication` view-controllers will be 'rendered'.
            //It would be the main application region by default, but if a layout it's defined for the Application object, a different region must be defined.
            appOptions.region = this._getChildAppRegion(appOptions);
    
            //Ommit instanciate config options
            var instanceOptions = _.omit(appOptions, 'applicationClass', 'startWithParent'),
                //Instance the `Jskeleton.ChildApplication` class with the `Jskeleton.ChildApplication` options specified
                instance = this.factory(appClass, {}, instanceOptions); //DI: resolve dependencies with the injector (using the factory object maybe)
    
            //expose the child application instance
            this._childApps[appName] = instance;
    
            //Start child application
            if (startWithParent === true) {
                this.startChildApp(instance, instanceOptions.startOptions);
            }
        },
        //Get the region where a `Jskeleton.ChildApplication` will be rendered when process a route or an event
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
                throw new Error('The region must exists in the Application.');
            }
    
            return region;
        },
        //Method to explicit start a child app instance
        startChildApp: function(childApp, options) {
            childApp.start(options);
        },
        //Get child app instance by name
        getChildApp: function(appName) {
            return this._childApps[appName];
        }
    });
    'use strict';
    
    /*globals Marionette, Jskeleton, _, Backbone */
    
    /* jshint unused: false */
    
    
    //## ChildApplication
    //  ChildApplication class is a 'container' where to store your webapp logic and split it into small 'pieces' and 'components'.
    //  It initializes regions, events, routes and channels.
    //  It cannot contain child applications.
    Jskeleton.ChildApplication = Jskeleton.BaseApplication.extend({
        //Default parent region name where the application will be rendered
        defaultRegion: 'root',
        constructor: function(options) {
            options = options || {};
            //reference to the parent app
            this.parentApp = options.parentApp;
    
            if (!options.region) {
                throw new Error('La child app tiene que tener una region específica');
            }
    
            //Add the injected region as root
            this.mainRegion = options.region;
    
            //Jskeleton.BaseApplication constructor
            Jskeleton.BaseApplication.prototype.constructor.apply(this, arguments);
    
            return this;
        },
        //Method to start the application and listening routes/events
        start: function(options) {
            this.triggerMethod('before:start', options);
    
            Jskeleton.BaseApplication.prototype.start.apply(this, arguments);
            // this._initAppEventsListeners(options);
    
            this.triggerMethod('start', options);
        },
        //Private method to initialize de application regions
        _initializeRegions: function() {
            //ensure initial root region is available
            this._ensureMainRegion();
    
            Marionette.Application.prototype._initializeRegions.apply(this, arguments);
    
            // Create a layout for the application if a layoutView its defined
            // this._createLayoutApp();
        },
        //Private method to ensure that parent region exists
        _ensureMainRegion: function() {
            if (!this.mainRegion || typeof this.mainRegion.show !== 'function') {
                throw new Error('Tienes que definir una region para la Child Application');
            }
        }
    });
    'use strict';
    
    /*globals Marionette, Jskeleton*/
    
    /* jshint unused: false */
    
    Jskeleton.View = Marionette.View.extend({
        constructor: function(options) {
            options = options || {};
    
            this.channel = options.channel || this;
            this._app = options.app;
    
            Marionette.View.apply(this, arguments);
    
        }
    }, {
        factory: Jskeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, Jskeleton*/
    
    /* jshint unused: false */
    
    Jskeleton.ItemView = Marionette.ItemView.extend({
        constructor: function(options) {
            Jskeleton.View.apply(this, arguments);
        }
    }, {
        factory: Jskeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, Jskeleton */
    
    /* jshint unused: false */
    
    Jskeleton.LayoutView = Marionette.LayoutView.extend({
    
        constructor: function(options) {
            options = options || {};
    
            this._firstRender = true;
            this._initializeRegions(options);
    
            Jskeleton.ItemView.call(this, options);
        }
    }, {
        factory: Jskeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, Jskeleton, _*/
    
    /* jshint unused: false */
    
    Jskeleton.CollectionView = Marionette.CollectionView.extend({
        constructor: function(options) {
    
            this.once('render', this._initialEvents);
    
            this._initChildViewStorage();
    
            Jskeleton.View.apply(this, arguments);
    
            this.on('show', this._onShowCalled);
    
            this.initRenderBuffer();
        },
        //override Marionette method to inject dependencies (as application channel, application reference ...) into child views
        buildChildView: function(child, ChildViewClass, childViewOptions) {
            var options = _.extend({
                model: child,
                channel: this.channel,
                _app: this._app
            }, childViewOptions);
    
    
            return new ChildViewClass(options);
        },
        getChildView: function(child) {
            var childView = this.getOption('childView');
    
            //The child view is a `Jskeleton.Factory` key string reference
            if (typeof childView === 'string') {
                childView = Jskeleton.factory.getClass(childView);
            }
    
            if (!childView) {
                throw new Marionette.Error({
                    name: 'NoChildViewError',
                    message: 'A "childView" must be specified'
                });
            }
    
    
            return childView;
        }
    }, {
        factory: Jskeleton.Utils.FactoryAdd
    });
    'use strict';
    
    /*globals Marionette, Jskeleton*/
    
    /* jshint unused: false */
    
    Jskeleton.CompositeView = Marionette.CompositeView.extend({
        constructor: function(options) {
            Jskeleton.CollectionView.apply(this, arguments);
        },
        getChildView: function(child) {
            var childView = this.getOption('childView');
    
            //The child view is a `Jskeleton.Factory` key string reference
            if (typeof childView === 'string') {
                childView = Jskeleton.factory.getClass(childView);
            }
    
            if (!childView) {
                childView = this.constructor;
            }
    
            return childView;
        }
    }, {
        factory: Jskeleton.Utils.FactoryAdd
    });
        'use strict';
    
        /*globals Jskeleton, Marionette, _ */
    
        //## ViewController
        // The view controller object is an hybrid of View/Controller. It is responsible for render an application
        // state, build up the application context and render the application components.
        Jskeleton.ViewController = Jskeleton.LayoutView.extend({
            constructor: function(options) {
                options = options || {};
                this._ensureOptions(options);
                this._app = options.app;
                this.region = options.region;
                this.service = options.service;
                this.context = {};
                this.components = {};
                this.events = this.events || {};
                Jskeleton.LayoutView.prototype.constructor.apply(this, arguments);
            },
            _ensureOptions: function(options) {
                if (!options.app) {
                    throw new Error('El view-controller necesita tener la referencia a su application');
                }
                if (!options.channel) {
                    throw new Error('El view-controller necesita tener un canal');
                }
                if (!options.region) { // mirarlo
                    throw new Error('El view-controller necesita tener una region específica');
                }
            },
            //expose application enviroment, ViewController context and `Marionette.templateHelpers` to the view-controller template
            mixinTemplateHelpers: function(target) {
                target = target || {};
                var templateHelpers = this.getOption('templateHelpers');
    
                templateHelpers = Marionette._getValue(templateHelpers, this);
    
    
                var templateContext = {
                    enviroment: {
                        _app: this._app,
                        _view: this,
                        _channel: this.channel
                    },
                    templateHelpers: templateHelpers,
                    context: this.context, // TODO: Mirar bien
                    serializedData: target
                };
    
                return templateContext;
            },
            addComponent: function(name, instance) {
                this.components[name] = this.components[name] || [];
                this.components[name].push(instance);
            },
            _destroyComponents: function() {
                var component;
    
                _.each(this.components, function(componentArray) {
                    for (var i = 0; i < componentArray.length; i++) {
                        component = componentArray[i];
    
                        if (component && _.isFunction(component.destroy)) {
                            component.destroy();
                        }
    
                        delete componentArray[i];
                    }
                });
            },
            //Override Marionette._delegateDOMEvents to add Components listeners
            _delegateDOMEvents: function(eventsArg) {
                var events = Marionette._getValue(eventsArg || this.events, this),
                    componentEvents = Jskeleton.Utils.extractComponentEvents(events);
    
                events = _.omit(events, _.keys(componentEvents));
    
                this._componentEvents = componentEvents;
    
    
                return Marionette.View.prototype._delegateDOMEvents.call(this, events);
            },
            //Bind event to the specified component using listenTo method
            _delegateComponentEvent: function(component, event, handlerName) {
                var handler = this[handlerName];
    
                if (!handler || typeof handler !== 'function') {
                    throw new Error('Tienes que definir un método valido como handler del evento de la vista');
                }
    
                if (component && component.isDestroyed !== true) {
                    this.listenTo(component, event, handler);
                }
            },
            //Bind off event to the specified component using off method
            _undelegateComponentEvent: function(component, event, handler) {
                this.off(event, handler);
            },
            unbindComponents: function() {
                var self = this,
                    components = this.components;
    
                _.each(this._componentEvents, function(method, eventName) {
                    var componentName = Jskeleton.Utils.normalizeComponentName(eventName),
                        eventType = Jskeleton.Utils.normailzeEventType(eventName),
                        componentArray = components[componentName];
    
                    _.each(componentArray, function(component) {
    
                        self._undelegateComponentEvent(component, eventType, method);
    
                    });
                });
            },
            //Attach events to the controller-view components to listenTo those events with `@component.ComponentName` event notation
            bindComponents: function() {
                var self = this,
                    components = this.components;
    
                _.each(this._componentEvents, function(method, eventName) {
                    //Get component name from event hash `@component.ComponentName`
                    var componentName = Jskeleton.Utils.normalizeComponentName(eventName),
                        //Get event name from event hash `click @component.ComponentName`
                        eventType = Jskeleton.Utils.normailzeEventType(eventName),
                        //Get the component instance by component name
                        componentArray = components[componentName];
    
                    _.each(componentArray, function(component) {
                        self._delegateComponentEvent(component, eventType, method);
                    });
                });
            },
            render: function() {
                this._destroyComponents();
    
                Jskeleton.LayoutView.prototype.render.apply(this, arguments);
    
                this.unbindComponents();
                this.bindComponents();
    
                return this;
            },
            destroy: function() {
                this._destroyComponents();
                return Marionette.LayoutView.prototype.destroy.apply(this, arguments);
            }
        });
     'use strict';
     /*globals Marionette, Jskeleton, _ */
     /* jshint unused: false */
    
    
    Marionette.Renderer.render = function(template, data) {
        data = data || {};
    
        // data.enviroment; //_app, channel, _view
        // data.templateHelpers; //Marionette template helpers view
        // data.serializedData; //Marionette model/collection serializedData
        // data.context; //View-controller context
    
        if (!template && template !== '') {
            throw new Marionette.Error({
                name: 'TemplateNotFoundError',
                message: 'Cannot render the template since its false, null or undefined.'
            });
        }
    
        template = typeof template === 'function' ? template(data) : template;
        template = typeof template === 'string' ? template : String(template);
    
        var compiler = Jskeleton.htmlBars.compiler,
             DOMHelper = Jskeleton.htmlBars.DOMHelper,
             hooks = Jskeleton.htmlBars.hooks,
             render = Jskeleton.htmlBars.render;
         // template = templateFunc();
    
        var template = template.replace(Jskeleton.Utils.regExpComponent, '\\{{@component'),
        hbs_compiler = Handlebars.compile(template, {KnowsHelpersOnly: false, strict:false, assumeObjects:false}),
        tmp_compiled = hbs_compiler(data);
    
        var templateSpec = compiler.compileSpec(tmp_compiled, {}),
            templatePreCompiled = compiler.template(templateSpec),
            env = {
                dom: new DOMHelper(),
                hooks: hooks,
                helpers: Jskeleton._helpers,
                enviroment: data.enviroment // for helper access to the enviroments
            },
            scope = hooks.createFreshScope();
    
        hooks.bindSelf(env, scope, data);
    
        //template access: context (view-controller context) , templateHelpers and model serialized data
    
        var dom = render(templatePreCompiled, env, scope, {
             //contextualElement: output
        }).fragment;
    
        return dom;
     };
    
        'use strict';
        /*globals Jskeleton */
    
        Jskeleton._helpers = {};
    
        Jskeleton.registerHelper = function(name, helperFunc) {
            Jskeleton._helpers[name] = helperFunc;
        };
    
    
        function normalizeArray(env, array) {
            var out = new Array(array.length);
    
            for (var i = 0, l = array.length; i < l; i++) {
                out[i] = env.hooks.getValue(array[i]);
            }
    
            return out;
        }
    
        function normalizeObject(env, object) {
            var out = {};
    
            for (var prop in object) {
                out[prop] = env.hooks.getValue(object[prop]);
            }
    
            return out;
        }
    
        Jskeleton.htmlBars.hooks.invokeHelper = function(morph, env, scope, visitor, _params, _hash, helper, templates, context) {
            var params = normalizeArray(env, _params);
            var hash = normalizeObject(env, _hash);
            return {
                value: helper.call(context, hash, env, params, templates)
            };
        };
         'use strict';
         /*globals  Jskeleton, _ */
         /* jshint unused: false */
    
         Jskeleton.registerHelper('@component', function(params, env) {
             // env.enviroment._app;
             // env.enviroment.channel;
             //env.enviroment._view, view-controller
             //
    
             params = params || {};
    
             var componentName = params.name,
                 ComponentClass,
                 component,
                 viewInstance = env.enviroment._view,
                 componentData;
    
             if (!componentName) {
                 throw new Error('Tienes que definir un nombre de clase');
             }
    
             //omit component factory name
             componentData = _.omit(params, 'name');
    
             //inject component dependencies
             componentData = _.extend(componentData, {
                 channel: env.enviroment._channel,
                 _app: env.enviroment._app
             });
    
             component = Jskeleton.factory.new(componentName, componentData);
    
             if (!component || typeof component !== 'object') {
                 throw new Error('No se ha podido crear el componente');
             }
    
             viewInstance.addComponent(componentName, component);
    
             return component.render().$el.get(0);
         });
    'use strict';
    /*globals Jskeleton,_ */
    /* jshint unused: false */
    
    var Hook = Jskeleton.Hook = function() {
        this.beforeCallbacks = [];
        this.afterCallbacks = [];
        return this;
    };
    
    
    Hook.prototype.before = function(callback) {
        this.beforeCallbacks.push(callback);
        return this;
    };
    
    Hook.prototype.after = function(callback) {
        this.afterCallbacks.push(callback);
        return this;
    };
    
    Hook.prototype.processBefore = function() {
        var self = this;
        _.each(this.beforeCallbacks, function(callback) {
            callback.apply(self);
        });
        this.beforeCallbacks = [];
        return this;
    };
    
    Hook.prototype.processAfter = function() {
        var self = this;
        _.each(this.afterCallbacks, function(callback) {
            callback.apply(self);
        });
        this.afterCallbacks = [];
        return this;
    };
    'use strict';
    /*globals Marionette, Jskeleton, _, Backbone */
    /* jshint unused: false */
    
    
    //Application object factory
    var factory = {};
    
    
    //Default available factory objects
    factory.prototypes = {
        Model: {
            Class: Backbone.Model
        },
        Collection: {
            Class: Backbone.Collection
        }
    };
    
    //Available singletons objects
    factory.singletons = {};
    
    //Adds an object class to the factory
    factory.add = function(key, ObjClass, ParentClass) {
    
        if (this.prototypes[key]) {
            throw new Error('AlreadyDefinedFactoryObject - ' + key);
        }
    
        this.prototypes[key] = {
            Class: ObjClass
        };
    
        if (ParentClass) {
            this.prototypes[key].Parent = ParentClass;
        }
    };
    
    
    //Creates a new object.
    //Can recieve an object class or a string object factory key.
    factory.new = function(obj, options) {
        options = options || {};
    
        var FactoryObject;
    
        if (typeof obj === 'object' || typeof obj === 'function') {
            FactoryObject = obj;
        } else {
            FactoryObject = this.prototypes[obj];
        }
    
        //resolve dependencies
    
    
        if (!FactoryObject) {
            throw new Error('UndefinedFactoryObject - ' + obj);
        }
    
        return FactoryObject.Class ? new FactoryObject.Class(options) : new FactoryObject(options);
    };
    
    
    
    //Creates a new singleton object o retrieves the created one
    factory.singleton = function(obj, options) {
        options = options || {};
    
        if (!this.singletons[obj]) {
            this.singletons[obj] = this.new(obj, options);
        }
    
        return this.singletons[obj];
    };
    
    
    //Retrieves an Object reference
    factory.get = function(obj) {
    
        if (!this.prototypes[obj]) {
            throw new Error('UndefinedFactoryObject - ' + obj);
        }
    
        return this.prototypes[obj];
    };
    
    //Retrieves an Object reference
    factory.getClass = function(obj) {
    
        if (!this.prototypes[obj]) {
            throw new Error('UndefinedFactoryObject - ' + obj);
        }
    
        return this.prototypes[obj].Class;
    };
    
    //Gets all objects added to the factory
    factory.getAll = function() {
        return this.prototypes;
    };
    
    
    Jskeleton.factory = factory;


    return Jskeleton;

});
