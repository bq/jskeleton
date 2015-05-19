     'use strict';
     /*globals  JSkeleton, _ */
     /* jshint unused: false */
     var shouldDisplay = function(param, param2, operator) {
         var result;

         if (operator) {

             if (!param2) {
                 throw new Error('If template helper error: If you define a operator, you must define a second parammeter');
             }

             switch (operator) {
                 case '===':
                     result = param === param2;
                     break;
                 case '==':
                     result = param == param2; // jshint ignore:line
                     break;
                 case '>':
                     result = param > param2;
                     break;
                 case '>=':
                     result = param >= param2;
                     break;
                 case '<':
                     result = param < param2;
                     break;
                 case '<=':
                     result = param <= param2;
                     break;
                 case '!=':
                     result = param != param2; // jshint ignore:line
                     break;
                 case '!==':
                     result = param !== param2;
                     break;
                 default:
                     result = false;
             }

         } else {
             result = !!param;
         }

         return result;
     };


     JSkeleton.registerHelper('if', function(params, env, args, options) {

         var condition = shouldDisplay(args[0], args[2], args[1]),
             truthyTemplate = options.template || '',
             falsyTemplate = options.inverse || '';

         var template = condition ? truthyTemplate : falsyTemplate;

         if (template && typeof template.render === 'function') {
             return template.render(undefined, env);
         }

     });