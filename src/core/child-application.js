'use strict';

/*globals Marionette, JSkeleton, _, Backbone */

/* jshint unused: false */


//## ChildApplication
//  ChildApplication class is a 'container' where to store your webapp logic and split it into small 'pieces' and 'components'.
//  It initializes regions, events, routes and channels.
//  It cannot contain child applications.
JSkeleton.ChildApplication = JSkeleton.BaseApplication.extend({
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

        //JSkeleton.BaseApplication constructor
        JSkeleton.BaseApplication.prototype.constructor.apply(this, arguments);

        return this;
    },
    //Method to start the application and listening routes/events
    start: function(options) {
        this.triggerMethod('before:start', options);

        JSkeleton.BaseApplication.prototype.start.apply(this, arguments);
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