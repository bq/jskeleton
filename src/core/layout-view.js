'use strict';

/*globals Marionette, JSkeleton */

/* jshint unused: false */

JSkeleton.LayoutView = Marionette.LayoutView.extend({

    constructor: function(options) {
        options = options || {};

        this._firstRender = true;
        this._initializeRegions(options);

        JSkeleton.ItemView.call(this, options);
    }
}, {
    factory: JSkeleton.Utils.FactoryAdd
});