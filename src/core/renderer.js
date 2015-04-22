 'use strict';
 /*globals Marionette, Jskeleton, _ */
 /* jshint unused: false */


 Marionette.Renderer.render = function(template, data) {
     data = data || {};

     // data.enviroment; //_app, channel, _view
     // data.templateHelpers; //Marionette template helpers view
     // data.serializedData; //Marionette model/collection serializedData
     // data.context; //View-controller context

     if (!template) {
         throw new Marionette.Error({
             name: 'TemplateNotFoundError',
             message: 'Cannot render the template since its false, null or undefined.'
         });
     }

     var compiler = Jskeleton.htmlBars.compiler,
         DOMHelper = Jskeleton.htmlBars.DOMHelper,
         hooks = Jskeleton.htmlBars.hooks,
         render = Jskeleton.htmlBars.render;
     // template = templateFunc();

     var templateSpec = compiler.compileSpec(template, {}),
         templatePreCompiled = compiler.template(templateSpec),
         env = {
             dom: new DOMHelper(),
             hooks: hooks,
             helpers: Jskeleton._helpers,
             jskeleton: data.enviroment // for helper access to the enviroments
         },
         scope = hooks.createFreshScope();

     hooks.bindSelf(env, scope, data.context);

     //template access: context (view-controller context) , templateHelpers and model serialized data

     var dom = render(templatePreCompiled, env, scope, {
         //contextualElement: output
     }).fragment;

     return dom;
 };