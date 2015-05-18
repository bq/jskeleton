'use strict';

/*globals Jskeleton, Backbone, _ */
/* jshint unused: false */

Jskeleton.Collection = Backbone.Collection.extend({

    _prepareModel: function(attrs, options) {

        if (this._isModel(attrs)) {
            if (!attrs.collection) attrs.collection = this;
            Jskeleton.modelStore.add(attrs);
            return attrs;
        }
        options = options ? _.clone(options) : {};
        options.collection = this;

        var model = new this.model(attrs, options);
        if (!model.validationError) {
            // Add new model to modelStore or update it
            Jskeleton.modelStore.add(model);
            return model;
        }
        this.trigger('invalid', this, model.validationError, options);
        return false;
    },

    _isModel: function(model) {
        return model instanceof Backbone.Model;
    }
});
