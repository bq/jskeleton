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
            this._layout = this.factory(this.layoutClass, this.layout.options);

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
            instance = this.factory(appClass, instanceOptions); //DI: resolve dependencies with the injector (using the factory object maybe)

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