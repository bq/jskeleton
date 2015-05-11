'use strict';

/*globals Marionette, Jskeleton*/

/* jshint unused: false */

Jskeleton.CompositeView = Marionette.CompositeView.extend({
    constructor: function(options) {
        Jskeleton.CollectionView.apply(this, arguments);
    },
    getChildView: function(child) {
        var childView = this.getOption('childView');

        //The child view is a `Jskeleton.Factory` key string reference
        if (typeof childView === 'string') {
            childView = Jskeleton.factory.getClass(childView);
        }

        if (!childView) {
            childView = this.constructor;
        }

        return childView;
    }
}, {
    factory: Jskeleton.Utils.FactoryAdd
});