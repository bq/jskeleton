'use strict';

/*globals Marionette, Jskeleton*/

/* jshint unused: false */

Jskeleton.View = Marionette.View.extend({
    constructor: function(options) {
        options = options || {};

        this._app = options.app;

        Marionette.View.apply(this, arguments);

    }
}, {
    factory: Jskeleton.Utils.FactoryAdd
});