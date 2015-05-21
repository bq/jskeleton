'use strict';

/*globals Marionette, JSkeleton*/

/* jshint unused: false */

JSkeleton.CompositeView = Marionette.CompositeView.extend({

    constructor: function(options) {
        JSkeleton.CollectionView.apply(this, arguments);
    },

    getChildView: function(child) {
        var childView = this.getOption('childView');

        //The child view is a `JSkeleton.Factory` key string reference
        if (typeof childView === 'string') {
            childView = JSkeleton.factory.getClass(childView);
        }

        if (!childView) {
            childView = this.constructor;
        }

        return childView;
    }
}, {
    factory: JSkeleton.Utils.FactoryAdd
});
