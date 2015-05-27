 'use strict';
 /*globals  JSkeleton, _ */
 /* jshint unused: false */
 var shouldDisplay = function(param, param2, operator) {
     var result;

     if (operator) {

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
     if (!options.template && !options.inverse) {
         // <strong  class="{{if assertion "result" "alternative"}}">
         // true --> <strong  class="result">
         // false --> <strong  class="alternative">
         var condition = args[0],
             truthyStr = args[1] || '',
             falsyStr = args[2] || '';

         return condition ? truthyStr : falsyStr;
     } else {
         var condition = shouldDisplay(args[0], args[2], args[1]),
             truthyTemplate = options.template || '',
             falsyTemplate = options.inverse || '';

         var template = condition ? truthyTemplate : falsyTemplate;

         if (template && typeof template.render === 'function') {
             return template.render(undefined, env);
         }
     }

 });
