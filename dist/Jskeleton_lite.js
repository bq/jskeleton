(function(root, factory) {
    'use strict';
    /*globals require,define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['jquery',
            'underscore',
            'backbone.marionette'
        ], function($, _, Marionette) {
            return factory.call(root, root, $, _, Marionette);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var $ = require('jquery'),
            _ = require('underscore'),
            Marionette = require('backbone.marionette'),
            Jskeleton = factory(root, $, _, Marionette);

        root.Jskeleton = Jskeleton;
        module.exports = Jskeleton;
    } else if (root !== undefined) {
        root.Jskeleton = factory.call(root, root, root.$, root._, root.Marionette);
    }

})(window, function(root, $, _, Marionette) {
    'use strict';
    /*globals require,requireModule */
    /* jshint unused: false */

    
    var Jskeleton = root.Jskeleton || {};

    Jskeleton.htmlBars = {
        compiler: requireModule('htmlbars-compiler'),
        DOMHelper: requireModule('dom-helper').default,
        hooks: requireModule('htmlbars-runtime').hooks,
        render: requireModule('htmlbars-runtime').render
    };

     'use strict';
     /*globals Marionette, Jskeleton, _ */
     /* jshint unused: false */
    
    
     Marionette.Renderer.render = function(template, data) {
         data = data || {};
    
         // data.enviroment; //_app, channel, _view
         // data.templateHelpers; //Marionette template helpers view
         // data.serializedData; //Marionette model/collection serializedData
         // data.context; //View-controller context
    
         if (!template) {
             throw new Marionette.Error({
                 name: 'TemplateNotFoundError',
                 message: 'Cannot render the template since its false, null or undefined.'
             });
         }
    
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
                 jskeleton: data.enviroment // for helper access to the enviroments
             },
             scope = hooks.createFreshScope();
    
         hooks.bindSelf(env, scope, data.context);
    
         //template access: context (view-controller context) , templateHelpers and model serialized data
    
         var dom = render(templatePreCompiled, env, scope, {
             //contextualElement: output
         }).fragment;
    
         return dom;
     };
src/helpers/html-bars.js not found
src/utils/hook.js not found
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
    'use strict';
    /*globals Marionette, Jskeleton, _, Backbone */
    /* jshint unused: false */
    
    var Application = Marionette.Application.extend({
        defaultEl: 'body',
        defaultRegion: 'root',
        isChildApp: false,
        globalChannel: 'global',
        constructor: function(options) {
            options = options || {};
            this.aid = this.getAppId();
            this.rootEl = options.rootEl || this.rootEl || this.defaultEl;
            this.router = Jskeleton.Router.getSingleton();
            if (options.parentApp) {
                this._childAppConstructor(options);
            }
            Marionette.Application.prototype.constructor.apply(this, arguments); //parent constructor (super)
            this.applications = options.applications || this.applications || {};
            this._childApps = {}; //instances object subapps
    
        },
        start: function(options) {
            this.triggerMethod('before:start', options);
            this._initCallbacks.run(options, this);
            this._initApplications(options); //init child apps
            this._initAppRoutesListeners(options); //init child apps
            this._initAppEventsListeners(options); //init child apps
            if (!this.parentApp) {
                this.startRouter();
            }
            this.triggerMethod('start', options);
        },
        processNavigation: function(controllerView) {
            var hook = this.getHook();
            this.triggerMethod('onNavigate', controllerView, hook);
            hook.processBefore();
            //TODO: Tener en cuenta que el controller puede no pintarse "asincronamente" si tiene un flag determinado, teniendo que devolver un promesa o algo por el estilo (lanzar un evento etc.)
            controllerView.processNavigation.apply(controllerView, Array.prototype.slice.call(arguments, 1));
            hook.processAfter();
        },
        startChildApp: function(childApp, options) {
            childApp.start(options);
        },
        factory: function(Class, options) {
            options = options || {};
            options.parentApp = this;
            return new Class(options);
        },
        startRouter: function() {
            this.router.start();
        },
        _initChannel: function() { //backbone.radio
            this.globalChannel = this.globalChannel ? Backbone.Radio.channel(this.globalChannel) : Backbone.Radio.channel('global');
            this.privateChannel = this.privateChannel ? Backbone.Radio.channel(this.privateChannel) : Backbone.Radio.channel(this.aid);
        },
        _childAppConstructor: function(options) {
            this.isChildApp = true; //flag if this is a childApp
            this.parentApp = options.parentApp; //reference to the parent app (if exist)
            if (!options.region) {
                throw new Error('La sub app tiene que tener una region específica');
            }
            this.region = options.region;
        },
        _initializeRegions: function() {
            if (!this.isChildApp) { // is a parent app (Main app)
                this._ensureEl(); //ensure initial root DOM reference is available
                this._initRegionManager();
                this._createRootRegion(); // Create root region on root DOM reference
                this._createLayoutApp();
            } else { //is childApp
                //TODO: ensure that parent region exists
            }
        },
        _ensureEl: function() {
            if (!this.$rootEl) {
                if (!this.rootEl) {
                    throw new Error('Tienes que definir una rootEl para la Main App');
                }
                this.$rootEl = $(this.rootEl);
            }
        },
        _createRootRegion: function() {
            this.addRegions({
                root: this.rootEl
            });
        },
        _createLayoutApp: function() {
            this.defaultRegion = 'root';
            if (this.layout && typeof this.layout === 'object') { //ensure layout object is defined
                this.layoutTemplate = this.layout.template; //TODO: lanzar aserción
                if (!this.layoutTemplate) {
                    throw new Error('Si defines un objeto layout tienes que definir un template');
                }
                this.layoutClass = this.layout.layoutClass || this.getDefaultLayoutClass();
                this.layoutClass = this.layoutClass.extend({
                    template: this.layoutTemplate
                });
                this._layout = this.factory(this.layoutClass, this.layout.options);
                this.root.show(this._layout);
    
                this._addLayoutRegions();
            }
        },
        _addLayoutRegions: function() {
            var self = this;
            if (this._layout.regionManager.length > 0) { //mirar lo del length de regions
                this.defaultRegion = undefined;
                _.each(this._layout.regionManager._regions, function(region, regionName) {
                    self[regionName] = region; //TOOD: mirar compartir instancias del region manager del layout
                });
            }
        },
        _initApplications: function() {
            if (!this.isChildApp) {
                var self = this;
                _.each(this.applications, function(value, key) {
                    self._initApp(key, value);
                });
                this.triggerMethod('applications:start');
            }
        },
        _initApp: function(appName, appOptions) {
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
        _getChildAppRegion: function(appOptions) {
            var region;
            if (this.defaultRegion) { //the default region is 'root'
                if (appOptions.region === undefined || appOptions.region === this.defaultRegion) { //the subapp region must be undefined or 'root'
                    region = this._regionManager.get(this.defaultRegion); //root region
                } else {
                    throw new Error('Tienes que crear en la aplicación (main) la region especificada a través de un layout');
                }
            } else {
                region = this._layout.regionManager.get(appOptions.region);
                if (!region) { //the region must exists
                    throw new Error('Tienes que crear en la aplicación (main) la region especificada a través de un layout');
                }
            }
            return region;
        },
        _initAppRoutesListeners: function() {
            var self = this;
            this._viewControllers = [];
            if (this.routes) {
                _.each(this.routes, function(value, key) {
                    self._addAppRoute(key, value);
                });
            }
        },
        _addAppRoute: function(routeString, routeOptions) {
            var self = this,
                viewController;
            viewController = this._getViewController(routeOptions);
    
            this.router.route(routeString, routeOptions.triggerEvent, function() {
                self.processNavigation.apply(self, [viewController].concat(arguments));
            });
        },
        _getViewController: function(options) {
            var self = this,
                viewClass = options.view,
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
        extendViewController: function(ViewControllerClass, template) {
            return ViewControllerClass.extend({
                template: template
            });
        },
        _initAppEventsListeners: function() {
            var self = this;
            this._controllers = [];
            if (this.events) {
                _.each(this.events, function(value, key) {
                    self._addAppEventListener(key, value);
                });
            }
        },
        _addAppEventListener: function(eventName, eventOptions) {
            var controller = this._getViewController(eventOptions),
                self = this;
    
            this.globalChannel.on(eventName, function() {
                self.processNavigation(controller);
            });
        },
        getChildApp: function(appName) {
            return this._childApps[appName];
        },
        getDefaultviewController: function() {
            return Jskeleton.ViewController;
        },
        getDefaultLayoutClass: function() {
            return Marionette.LayoutView;
        },
        getHook: function() {
            return new Jskeleton.Hook();
        },
        getAppId: function() {
            return _.uniqueId('a');
        }
    });
    
    
    Jskeleton.Application = Application;
    
        'use strict';
        /*globals Jskeleton, Marionette, _ */
    
        Jskeleton.ViewController = Marionette.LayoutView.extend({
            constructor: function(options) { //inyectar app, channel, region
                options = options || {};
                this._ensureOptions(options);
                this._app = options.app;
                this.channel = options.channel;
                this.region = options.region;
                this.service = options.service;
                this.context = {};
                Marionette.LayoutView.prototype.constructor.apply(this, arguments);
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
            processNavigation: function(route) {
                this.triggerMethod('before:navigate');
    
                this.triggerMethod('state:change', this.service, route);
    
                this.renderViewController();
    
                this.triggerMethod('navigate');
            },
            renderViewController: function() {
                this.render();
            },
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
            }
            //onRender: function(){
            //
            //}
            // onBeforeNavigate: function(){
            // 	//TODO: service
            // }
            // onNavigate: function(){
            // 	//TODO: service
            // }
        });


    return Jskeleton;

});
