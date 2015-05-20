     'use strict';
     /*globals  JSkeleton, _ */
     /* jshint unused: false */

     JSkeleton.registerHelper('@component', function(params, env, args) {
         // env.enviroment._app;
         // env.enviroment.channel;
         //env.enviroment._view, view-controller
         //

         params = params || {};

         var componentName = typeof args[0] === 'string' ? args[0] : params.name,
             ComponentClass,
             component,
             viewInstance = env.enviroment._view,
             componentData;

         if (!componentName) {
             throw new Error('You must define a Component Class Name.');
         }

         //omit component factory name
         componentData = _.omit(params, 'name');

         //inject component dependencies
         componentData = _.extend(componentData, {
             _app: env.enviroment._app
         });

         component = JSkeleton.factory.new(componentName, componentData);

         if (!component || typeof component !== 'object') {
             throw new Error('It is not possible create the component.');
         }

         viewInstance.addComponent(componentName, component);

         return component.render().$el.get(0);
     });