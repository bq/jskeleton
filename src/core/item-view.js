'use strict';

/*globals Marionette, Jskeleton*/

/* jshint unused: false */

Jskeleton.ItemView = Marionette.ItemView.extend({
    constructor: function(options) {
        Jskeleton.View.apply(this, arguments);
    }
}, {
    factory: Jskeleton.Utils.FactoryAdd
});