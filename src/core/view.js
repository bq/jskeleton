'use strict';

/*globals Marionette, JSkeleton*/

/* jshint unused: false */

JSkeleton.View = Marionette.View.extend({
    constructor: function(options) {
        options = options || {};

        this._app = options.app;

        Marionette.View.apply(this, arguments);

    }
}, {
    factory: JSkeleton.Utils.FactoryAdd
});