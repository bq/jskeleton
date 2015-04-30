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

        module.exports = Jskeleton;
    } else if (root !== undefined) {
        root.Jskeleton = factory.call(root, root, root.$, root._, root.Backbone, root.Marionette);
    }

})(this, function(root, $, _, Backbone, Marionette) {
    'use strict';

    /* jshint unused: false */


    var Jskeleton = root.Jskeleton || {};

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
    
         var templateSpec = compiler.compileSpec(template, {}),
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
        Model: Backbone.Model,
        Collection: Backbone.Collection
    };
    
    //Available singletons objects
    factory.singletons = {};
    
    //Adds an object class to the factory
    factory.add = function(key, obj) {
        if (this.prototypes[key]) {
            throw new Error('AlreadyDefinedFactoryObject - ' + key);
        }
        this.prototypes[key] = obj;
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
    
        if (!FactoryObject) {
            throw new Error('UndefinedFactoryObject - ' + obj);
        }
    
        return new FactoryObject(options);
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
    
    //Gets all objects added to the factory
    factory.getAll = function() {
        return this.prototypes;
    };
    
    
    Jskeleton.factory = factory;
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
    
    'use strict';
    /*globals Marionette, Jskeleton, _ */
    /* jshint unused: false */
    
    /**
     * Reusable component as a Service
     */
    var Service = Marionette.Object.extend({
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
    
    });
    
    Jskeleton.Service = Service;
    
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
        _proxyEvents: function(options) {
            var events = options.events || this.events || {};
    
            this._proxyTriggerEvents(events.triggers);
            this._proxyListenEvents(events.listen);
        },
        _proxyTriggerEvents: function(triggerArray) {
            var self = this;
            if (triggerArray && typeof triggerArray === 'object') {
                _.each(triggerArray, function(eventName) {
                    self.listenTo(self.privateChannel, eventName, function() {
                        var args;
    
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
        _proxyListenEvents: function(listenObject) {
            var self = this;
            if (listenObject && typeof listenObject === 'object') {
                _.each(listenObject, function(eventName) {
                    self.listenTo(self.globalChannel, eventName, function() {
                        var args;
    
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
    
            this._initCallbacks.run(options, this);
    
            //Add routes listeners to the Jskeleton.router
            this._initRoutes(options);
    
            //Add app proxy events
            this._proxyEvents(options);
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
    'use strict';
    
    /*globals Marionette, Jskeleton, _, Backbone */
    
    /* jshint unused: false */
    
    
    //## Application
    //  Application class is a 'container' where to store your webapp logic and split it into small 'pieces' and 'components'.
    //  It initializes regions, events, routes, channels and child apps.
    //  It has a global channel to communicate with others apps and a private channel to communicate with it's components,
    //  A Jskeleton webapp can contain many Jskeleton.Applications.
    //  A Jskeleton.Application can define multiple child applications (Jskeleton.ChildApplication).
    Jskeleton.Application = Jskeleton.BaseApplication.extend({
        //Default dom reference (usefull for the first webapp root region)
        defaultEl: 'body',
        defaultRegion: 'root',
        constructor: function(options) {
            options = options || {};
    
            this.rootEl = options.rootEl || this.rootEl || this.defaultEl;
    
            //Jskeleton.BaseApplication constructor
            Jskeleton.BaseApplication.prototype.constructor.apply(this, arguments);
    
            this.applications = options.applications || this.applications || {};
            //private object instances of applications
            this._childApps = {};
    
            return this;
    
        },
        //Method to start the application, start the childapplications and start listening routes/events
        start: function(options) {
            this.triggerMethod('before:start', options);
            //init child apps
            this._initChildApplications(options);
    
            Jskeleton.BaseApplication.prototype.start.apply(this, arguments);
    
            //Start the Jskeleton router
            this.startRouter();
            this.triggerMethod('start', options);
        },
        //Method to explicit start a child app instance
        startChildApp: function(childApp, options) {
            childApp.start(options);
        },
        //Method to start listening the backbone.router (called by a Main app)
        startRouter: function() {
            this.router.start();
        },
        //Private method to initialize the application regions
        _initializeRegions: function() {
            //ensure initial root DOM reference is available
            this._ensureEl();
    
            Marionette.Application.prototype._initializeRegions.apply(this, arguments);
    
            // Create root region on root DOM reference
            this._createRootRegion();
            // Create a layout for the application if a layoutView its defined
            this._createApplicationLayout();
        },
        //Private method to ensure that the main application has a dom reference where create the root webapp region
        _ensureEl: function() {
            if (!this.$rootEl) {
                if (!this.rootEl) {
                    throw new Error('Tienes que definir una rootEl para la Main App');
                }
                this.$rootEl = $(this.rootEl);
            }
        },
        //Add the root region to the main application
        _createRootRegion: function() {
            this.addRegions({
                root: this.rootEl
            });
        },
        //Create a layout for the Application to have more regions
        //Adds the layout regions to the application object as properties
        _createApplicationLayout: function() {
            //ensure layout object is defined
            if (this.layout && typeof this.layout === 'object') {
                this.layoutTemplate = this.layout.template; //TODO: lanzar aserción
                if (!this.layoutTemplate) {
                    throw new Error('Si defines un objeto layout tienes que definir un template');
                }
    
                this.layoutClass = this.layout.layoutClass || this.getDefaultLayoutClass(); //TODO: mirar si poner layout por defecto ( seria necesario entonces poder poner regiones de forma explicita)
                this.layoutClass = this.layoutClass.extend({
                    template: this.layoutTemplate
                });
                this._layout = this.factory(this.layoutClass, this.layout.options);
                this.root.show(this._layout);
    
                this._addLayoutRegions();
            }
        },
        //Expose layout regions to the application namespace
        _addLayoutRegions: function() {
            var self = this;
            if (this._layout.regionManager.length > 0) { //mirar lo del length de regions
                _.each(this._layout.regionManager._regions, function(region, regionName) {
                    self[regionName] = region; //TOOD: mirar compartir instancias del region manager del layout
                });
            }
        },
        //Iterate over child applications to start each one
        _initChildApplications: function() {
            if (!this.isChildApp) {
                var self = this;
                _.each(this.applications, function(value, key) {
                    self._initChildApp(key, value);
                });
                this.triggerMethod('applications:start');
            }
        },
        //Start child application with it's dependencies injected
        _initChildApp: function(appName, appOptions) {
            var appClass = appOptions.appClass,
                startWithParent = appOptions.startWithParent !== undefined ? appOptions.startWithParent : true;
    
            appOptions.region = this._getChildAppRegion(appOptions);
    
            if (startWithParent === true) {
                var instanceOptions = _.omit(appOptions, 'appClass', 'startWithParent'),
                    instance = this.factory(appClass, instanceOptions);
                this._childApps[appName] = instance;
                this.startChildApp(instance, instanceOptions.startOptions);
            }
        },
        //Get the region where a child application will be rendered when process a route or an event
        _getChildAppRegion: function(appOptions) {
            var region;
    
            if (this._layout && this._layout.regionManager) {
                region = this._layout.regionManager.get(appOptions.region || this.defaultRegion);
            }
    
            if (!region) { //the region must exists
                throw new Error('Tienes que crear en la aplicación (main) la region especificada a través de un layout');
            }
    
            return region;
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
    });
    'use strict';
    
    /*globals Marionette, Jskeleton*/
    
    /* jshint unused: false */
    
    Jskeleton.ItemView = Marionette.ItemView.extend({
        constructor: function(options) {
            Jskeleton.View.apply(this, arguments);
        }
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
        }
    });
    'use strict';
    
    /*globals Marionette, Jskeleton*/
    
    /* jshint unused: false */
    
    Jskeleton.CompositeView = Marionette.CompositeView.extend({
        constructor: function(options) {
            Jskeleton.CollectionView.apply(this,arguments);
        }
    });
    
        'use strict';
    
        /*globals Jskeleton, Marionette, _ */
    
        Jskeleton.ViewController = Jskeleton.LayoutView.extend({
            constructor: function(options) { //inyectar app, channel, region
                options = options || {};
                this._ensureOptions(options);
                this._app = options.app;
                this.region = options.region;
                this.service = options.service;
                this.context = {};
                this.components = {};
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
            //expose app enviroment, view-controller context and marionette.templateHelpers to the view-controller template
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
    
                        if (_.isFunction(component.destroy)) {
                            component.destroy();
                        }
                    }
                });
            },
            _delegateDOMEvents: function(eventsArg) {
                var events = Marionette._getValue(eventsArg || this.events, this),
                    componentEvents = Jskeleton.utils.extractComponentEvents(events);
    
                events = _.omit(events, _.keys(componentEvents));
    
                this._componentEvents = componentEvents;
    
    
                return Marionette.View.prototype._delegateDOMEvents.call(this, events);
            },
            _delegateComponentEvent: function(component, event, handlerName) {
                var handler = this[handlerName];
    
                if (!handler || typeof handler !== 'function') {
                    throw new Error('Tienes que definir un método valido como handler del evento de la vista');
                }
    
                if (component && component.isDestroyed !== true) {
                    this.listenTo(component, event, handler);
                }
            },
            _undelegateComponentEvent: function(component, event, handler) {
                this.off(event, handler);
            },
            unbindComponents: function() {
                var self = this,
                    components = this.components;
    
                _.each(this._componentEvents, function(method, eventName) {
                    var componentName = Jskeleton.utils.normalizeComponentName(eventName),
                        eventType = Jskeleton.utils.normailzeEventType(eventName),
                        componentArray = components[componentName];
    
                    _.each(componentArray, function(component) {
    
                        self._undelegateComponentEvent(component, eventType, method);
    
                    });
                });
            },
            bindComponents: function() {
                var self = this,
                    components = this.components;
    
                _.each(this._componentEvents, function(method, eventName) {
                    var componentName = Jskeleton.utils.normalizeComponentName(eventName),
                        eventType = Jskeleton.utils.normailzeEventType(eventName),
                        componentArray = components[componentName];
    
                    _.each(componentArray, function(component) {
    
                        self._delegateComponentEvent(component, eventType, method);
    
                    });
                });
            },
            render: function() {
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
    


    return Jskeleton;

});