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
    //Default dom reference (usefull for the first webapp root region)
    defaultEl: 'body',
    defaultRegion: 'root',
    constructor: function(options) {
        options = options || {};

        this.rootEl = options.rootEl || this.rootEl || this.defaultEl;

        this._region = options.region || this.defaultRegion;

        //`Jskeleton.BaseApplication` constructor
        Jskeleton.BaseApplication.prototype.constructor.apply(this, arguments);

        this.applications = options.applications || this.applications || {};
        //private object instances of applications
        this._childApps = {};

        return this;

    },
    //Method to start the application, start the `ChildApplications` and start listening routes/events
    start: function(options) {
        this.triggerMethod('before:start', options);
        //init child apps
        this._initChildApplications(options);

        Jskeleton.BaseApplication.prototype.start.apply(this, arguments);

        //Start the `Jskeleton.Router`
        this.startRouter();
        this.triggerMethod('start', options);
    },
    //Method to explicit start a child app instance
    startChildApp: function(childApp, options) {
        childApp.start(options);
    },
    //Method to start listening the `Backbone.Router` (called by a Main Application)
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

        if (this._region instanceof Marionette.Region) {
            //TODO
        } else {
            var rootRegion = {};

            rootRegion[this._region] = this.rootEl;

            this.addRegions(rootRegion);
        }
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
            _.each(this.applications, function(value, key) {
                self._initChildApp(key, value);
            });
            this.triggerMethod('applications:start');
        }
    },
    //Start child application with it's dependencies injected
    _initChildApp: function(appName, appOptions) {
        var appClass = appOptions.applicationClass,
            startWithParent = appOptions.startWithParent !== undefined ? appOptions.startWithParent : true;

        appOptions.region = this._getChildAppRegion(appOptions);

        var instanceOptions = _.omit(appOptions, 'applicationClass', 'startWithParent'),
            instance = this.factory(appClass, instanceOptions);
        this._childApps[appName] = instance;

        //Start child application
        if (startWithParent === true) {
            this.startChildApp(instance, instanceOptions.startOptions);
        }
    },
    //Get the region where a child application will be rendered when process a route or an event
    _getChildAppRegion: function(appOptions) {
        var region,
            regionName = appOptions.region || this.defaultRegion;

        //retrieve the region from the application layout
        if (this._layout && this._layout.regionManager) {
            region = this._layout.regionManager.get(regionName);
        }

        //retrieve the region from the application region manager
        if (!region) {
            region = this._regionManager.get(regionName);
        }

        //the region must exists
        if (!region) {
            throw new Error('The region must exists in the Parent application.');
        }

        return region;
    },
    //Get child app instance by name
    getChildApp: function(appName) {
        return this._childApps[appName];
    }
});