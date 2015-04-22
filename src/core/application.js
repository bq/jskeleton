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
