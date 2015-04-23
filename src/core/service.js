'use strict';
/*globals Marionette, Jskeleton, _ */
/* jshint unused: false */

/**
 * Reusable component as a Service
 */
var Service = Marionette.Object.extend({
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

});

Jskeleton.Service = Service;
