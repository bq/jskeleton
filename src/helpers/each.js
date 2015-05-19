      'use strict';
      /*globals  JSkeleton, _, Backbone */
      /* jshint unused: false */

      JSkeleton.registerHelper('each', function(params, env, args, options) {
          var itemName = args[0],
              collection = args[2],
              template = options.template;
          // domFragment = env.dom.createDocumentFragment();

          if (!collection) {
              return;
          }

          if (typeof itemName !== 'string') {
              throw new Error('You have to define a valid string name for the iteration in the each helper.');
          }

          var scope = env.hooks.createChildScope(env.scope);

          var renderTemplate = function(count, element) {
              var child,
                  data;

              if (element instanceof Backbone.Model) {
                  data = element.toJSON();
              } else {
                  data = element;
              }

              scope.self[itemName] = _.extend({
                  count: count
              }, data);


              if (template && typeof template.render === 'function') {
                  template.yieldItem('each', scope);
              }
          };

          //the collection has an each implementation
          if (collection.each) {

              //iterate over the collection
              collection.each(function(element, count) {
                  renderTemplate(count, element);
              });

          } else {

              //the collection doesn't have an each implementation
              for (var i = 0; i < collection.length; i++) {
                  renderTemplate(i, collection[i]);
              }

          }

          scope.self[itemName] = {};

          env.hooks.updateScope(env, env.scope);

      });