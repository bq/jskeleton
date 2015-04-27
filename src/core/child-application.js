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

        this._initCallbacks.run(options, this);
        //Add routes listeners to the Jskeleton.router
        this._initRoutes(options);
        //Add app events listeneres to the global channel
        // this._initAppEventsListeners(options);

        this.triggerMethod('start', options);
    },
    //Private method to initialize de application regions
    _initializeRegions: function() {
        //ensure initial root region is available
        this._ensureMainRegion();

        this._initRegionManager();

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