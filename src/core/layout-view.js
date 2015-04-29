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