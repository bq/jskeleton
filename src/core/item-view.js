'use strict';

/*globals Marionette, JSkeleton*/

/* jshint unused: false */

JSkeleton.ItemView = Marionette.ItemView.extend({
    constructor: function(options) {
        JSkeleton.View.apply(this, arguments);
    }
}, {
    factory: JSkeleton.Utils.FactoryAdd
});