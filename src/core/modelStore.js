'use strict';
/*globals Jskeleton, Backbone, Marionette _ */
/* jshint unused: false */

//## Jskeleton.ModelStore
Jskeleton.ModelStore = Marionette.Object.extend({

    initialize: function() {
        this.storage = new Backbone.Collection();
    },

    // Add or Update model
    add: function(model) {
        if (!(model instanceof Backbone.Model)) {
            throw new Error("model added must be exist and must be an instance of Backbone.Model");
        }

        // If Class organization exist
        if (this.classExist(model)) {
            _.each(this.storage.models, function(itemModel) {
                if (itemModel.get('Class') === model.constructor) {
                    // if model instance exist, set attributes
                    if (itemModel.get('instances').get(model.id)) {
                        itemModel.get('instances').get(model.id).set(model.attributes);
                    } else {
                        // else, add to collection instance
                        itemModel.get('instances').add(model);
                    }
                }
            });
        } else {
            // If Class not exist, create new group and insert the first instance model
            var modelsGroup = new Backbone.Model({
                instances: new Backbone.Collection(model)
            }).set({
                'Class': model.constructor
            });
            this.storage.add(modelsGroup);
        }
        return this;
    },

    // get model by Id and model Class
    get: function(modelId, classConstructor) {
        if (!classConstructor || typeof classConstructor !== 'function') {
            throw new Error("classConstructor must be exist");
        }
        if (!modelId) {
            throw new Error("modelId must be exist");
        }

        var instance = undefined;
        _.each(this.storage.models, function(itemModel) {
            if (itemModel.get('Class') === classConstructor) {
                instance = itemModel.get('instances').get(modelId);
                return;
            }
        });
        return instance;
    },

    // remove model from store
    remove: function(model) {
        if (!(model instanceof Backbone.Model)) {
            throw new Error("model added must be exist and must be an instance of Backbone.Model");
        }
        _.each(this.storage.models, function(itemModel) {
            // Todo if instance model exist, update it!
            if (itemModel.get('Class') === model.constructor) {

                // if model exist, update it
                if (itemModel.get('instances').get(model.id)) {
                    itemModel.get('instances').remove(model);
                }
            }
        });
    },

    // Get all models by model Class
    getAll: function(classConstructor) {
        if (!classConstructor || typeof classConstructor !== 'function') {
            throw new Error("classConstructor must be exist");
        }

        var _instances = undefined;
        _.each(this.storage.models, function(itemModel) {
            if (itemModel.get('Class') === classConstructor) {
                _instances = itemModel.get('instances').models;
                return;
            }
        });
        return _instances;
    },

    // Check if Class Exist by model instance or model Class
    classExist: function(param) {
        if (typeof param !== 'function' && !(param instanceof Backbone.Model)) {
            throw new Error("param must be exist and must be a function or a instance model");
        }

        var exist = false;
        if (this.storage.models.length > 0) {

            _.each(this.storage.models, function(itemModel) {
                // instance model
                if (param instanceof Backbone.Model) {
                    if (itemModel.get('Class') === param.constructor) {
                        exist = true;
                        return;
                    }
                } else if (typeof param === 'function') {
                    if (itemModel.get('Class') === param) {
                        exist = true;
                        return;
                    }
                }
            });
        }
        return exist;
    },

    // Check if model exist into a Class organization by modelId and model Class
    modelExist: function(modelId, classConstructor) {
        var exist = false;
        if (this.storage.models.length > 0) {

            _.each(this.storage.models, function(itemModel) {
                if (itemModel.get('Class') === classConstructor) {
                    if (itemModel.get('instances') && itemModel.get('instances').get(modelId)) {
                        exist = true;
                        return;
                    }
                }
            });
        }
        return exist;
    }
});


Jskeleton.modelStore = new Jskeleton.ModelStore();
