'use strict';

/*globals Marionette, Jskeleton*/

/* jshint unused: false */

Jskeleton.View = Marionette.View.extend({
    constructor: function(options) {
        options = options || {};

        this.channel = options.channel || this;
        this._app = options.app;

        Marionette.View.apply(this, arguments);

    }
});