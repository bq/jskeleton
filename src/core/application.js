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
        this._initCallbacks.run(options, this);
        //init child apps
        this._initChildApplications(options);
        //Add routes listeners to the Jskeleton.router
        this._initRoutes(options);
        //Add app events listeneres to the global channel
        // this._initAppEventsListeners(options);
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
        this._initRegionManager();
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
    _createApplicationLayout: function() {
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
    //Expose layout regions to the application namespace
    _addLayoutRegions: function() {
        var self = this;
        if (this._layout.regionManager.length > 0) { //mirar lo del length de regions
            this.defaultRegion = undefined;
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
    //Get the region where a child application will be rendered
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
    //Get child app instance by name
    getChildApp: function(appName) {
        return this._childApps[appName];
    }
});