'use strict';
/*globals Marionette, JSkeleton, _ */
/* jshint unused: false */

/**
 * Reusable component as a Service
 */
JSkeleton.Service = Marionette.Object.extend({
    constructor: function(opts) {
        var options = opts || {},
            // Todo serviceOptions ?
            serviceOptions = ['model', 'collection', 'events'];

        _.extend(this, _.pick(options, serviceOptions));

        this.options = _.extend({}, this.options, this.defaults, options);

        if (_.isFunction(this.initialize)) {
            this.initialize.apply(this, arguments);
        }
    }

}, {
    factory: JSkeleton.Utils.FactoryAdd
});