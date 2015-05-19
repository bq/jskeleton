 'use strict';
 /*globals Marionette, JSkeleton, _ */
 /* jshint unused: false */


 Marionette.Renderer.render = function(template, data) {
     data = data || {};

     // data.enviroment; //_app, channel, _view
     // data.templateHelpers; //Marionette template helpers view
     // data.serializedData; //Marionette model/collection serializedData
     // data.context; //View-controller context

     if (!template && template !== '') {
         throw new Marionette.Error({
             name: 'TemplateNotFoundError',
             message: 'Cannot render the template since its false, null or undefined.'
         });
     }

     template = typeof template === 'function' ? template(data) : template;

     template = typeof template === 'string' ? template : String(template);

     var compiler = JSkeleton.htmlBars.compiler,
         DOMHelper = JSkeleton.htmlBars.DOMHelper,
         hooks = JSkeleton.htmlBars.hooks,
         render = JSkeleton.htmlBars.render;

     var templateSpec = compiler.compileSpec(template, {}),
         templatePreCompiled = compiler.template(templateSpec),
         env = {
             dom: new DOMHelper(),
             hooks: hooks,
             helpers: JSkeleton._helpers,
             enviroment: data.enviroment,
             scope: hooks.createFreshScope() // for helper access to the enviroments
         };

     hooks.bindSelf(env, env.scope, data);

     //template access: context (view-controller context) , templateHelpers and model serialized data

     var dom = render(templatePreCompiled, env, env.scope, {
         //contextualElement: output
     }).fragment;

     return dom;
 };