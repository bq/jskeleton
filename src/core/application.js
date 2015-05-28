'use strict';

/*globals Marionette, JSkeleton, _, Backbone */

/* jshint unused: false */

//## Application
//  Application class is a 'container' where to store your webapp logic and split it into small 'pieces' and 'components'.
//  It initializes `regions, events, routes, channels and child applications`.
//  It has a global channel to communicate with others apps and a private channel to communicate with it's components,
//  A JSkeleton webapp can contain many JSkeleton.Applications.
//  A `JSkeleton.Application` can define multiple child applications (`JSkeleton.ChildApplication`).
JSkeleton.Application = JSkeleton.BaseApplication.extend({
    //Default el dom reference if no `el` it's specified
    defaultEl: 'body',
    //Main region name. Will be 'main' by default
    mainRegionName: 'main',
    waitBeforeStartHooks: true,
    constructor: function(options) {

        options = options || {};

        this.el = options.el || this.el || this.defaultEl;

        this._region = options.region || this.mainRegionName;

        //`JSkeleton.BaseApplication` constructor
        JSkeleton.BaseApplication.prototype.constructor.apply(this, arguments);

        this.applications = options.applications || this.applications || {};

        this._beforeStartHooks = _.clone(this.beforeStartHooks);

        //private object instances of applications
        this._childApps = {};

        return this;

    },
    //Method to start the application, start the `ChildApplications` and start listening routes/events.
    //This method will wait until the beforeStartHooks defined in the application will be completed (with a promise).
    //If an option waitBeforeStartHooks it's set to false, the application won't wait hooks before start.
    start: function(options) {

        // this.renderInitialState();s

        //Wait for all the JSkeleton.extensions
        if (this.waitBeforeStartHooks) {

            this.triggerMethod('before:extension:start', options);

            var self = this;

            this._waitBeforeStartHooks().then(function() {

                self.triggerMethod('extension:start', options);

                //
                //
                self._startApplication(options);
            });

        } else {
            //
            this._startApplication(options);
        }

    },
    //Method to start listening the `Backbone.Router`
    //Only a `JSkeleton.Application' can start a `JSkeleton.Router` instance.
    //The JSkeleton.Router is created by the `JSkeleton.Application` objects and injected to the `JSkeleton.ChildApplication`.
    startRouter: function() {
        this.router.start();
    },
    //
    //
    //
    _startApplication: function(options) {

        //trigger before:start event and call to onBeforeStart method if it's defined in the application object
        this.triggerMethod('before:start', options);

        // Create a layout for the application if a viewController its defined
        this._createApplicationViewController();

        //initialize and start child applications defined in the application object
        this._initChildApplications(options);

        JSkeleton.BaseApplication.prototype.start.apply(this, arguments);

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
        this._createMainRegion();
    },
    //Private method to ensure that the main application has a dom reference where create the root webapp region
    _ensureEl: function() {
        if (!this.$el) {
            if (!this.el) {

                throw new Error('It is necessary to define a \'el\' for Main App');
            }
            this.$el = $(this.el);
        }
    },
    //Add the root region to the main application
    _createMainRegion: function() {

        if (this._region instanceof Marionette.Region) {
            //TODO
        } else {
            //create a new `JSkeleton.Region`
            var mainRegion = {};

            mainRegion[this._region] = this.el;

            this.addRegions(mainRegion);
        }
    },
    //Create a layout for the Application to have more regions availables.
    //The application expose the layout regions to the application object as own properties.
    _createApplicationViewController: function() {

        //ensure viewController object is defined
        if (this.viewController) {
            //get viewController class
            var ViewController = typeof this.viewController === 'object' && this.viewController.viewControllerClass ? this.viewController.viewControllerClass : this.viewController,
                //get the viewController that will be passed to the view controller constructor
                viewControllerOptions = typeof this.viewController === 'object' && this.viewController.viewControllerOptions ? this.viewController.viewControllerOptions : {},
                //extend viewController template
                viewControllerExtendTemplate = typeof this.viewController === 'object' && this.viewController.template ? {
                    template: this.viewController.template
                } : undefined,
                handlerName = this.viewController.handlerName ? this.viewController.handlerName : '';

            viewControllerOptions = _.extend(viewControllerOptions, {
                app: this,
                channel: this.privateChannel
            });

            //create the view-controller instance
            this._viewController = this.getInstance(ViewController, viewControllerExtendTemplate, viewControllerOptions);

            //Show the view-controller in the application main region
            this._viewController.show(this[this.mainRegionName], handlerName);

            //expose the view-controller regions to the application object
            this._addViewControllerRegions();
        }

    },
    //Expose view-controller regions to the application namespace
    _addViewControllerRegions: function() {
        var self = this;
        if (this._viewController.regionManager.length > 0) {
            _.each(this._viewController.regionManager._regions, function(region, regionName) {
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
        var instanceOptions = _.omit(appOptions, 'applicationClass', 'startWithParent'),
            //Instance the `JSkeleton.ChildApplication` class with the `JSkeleton.ChildApplication` options specified
            instance = this.getInstance(appClass, {}, instanceOptions); //DI: resolve dependencies with the injector (using the factory object maybe)

        //expose the child application instance
        this._childApps[appName] = instance;

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
        if (this._viewController && this._viewController.regionManager) {
            region = this._viewController.regionManager.get(regionName);
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
        return this._childApps[appName];
    }
});