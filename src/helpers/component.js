     'use strict';
     /*globals  Jskeleton, _ */
     /* jshint unused: false */

     Jskeleton.registerHelper('@component', function(params, env, args) {
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
             throw new Error('Tienes que definir un nombre de clase');
         }

         //omit component factory name
         componentData = _.omit(params, 'name');

         //inject component dependencies
         componentData = _.extend(componentData, {
             _app: env.enviroment._app
         });

         component = Jskeleton.factory.new(componentName, componentData);

         if (!component || typeof component !== 'object') {
             throw new Error('No se ha podido crear el componente');
         }

         viewInstance.addComponent(componentName, component);

         return component.render().$el.get(0);
     });