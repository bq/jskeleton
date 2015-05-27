    'use strict';

    /*globals JSkeleton, Marionette, _ */

    //## ViewController
    // The view controller object is an hybrid of View/Controller. It is responsible for render an application
    // state, build up the application context and render the application components.
    JSkeleton.ViewController = JSkeleton.LayoutView.extend({
        //re-render the view-controller when the render promise is completed
        renderOnPromise: true,
        constructor: function(options) {
            options = options || {};
            this._ensureOptions(options);
            this._app = options.app;
            this.region = options.region;
            this.service = options.service;
            this.context = {};
            this.components = {};
            this.events = this.events || {};
            this.handlerName = options.handlerName || {};
            JSkeleton.LayoutView.prototype.constructor.apply(this, arguments);
        },

        _ensureOptions: function(options) {
            if (!options.app) {
                throw new Error('View-controller needs to have the reference to its application');
            }
        },

        //expose application enviroment, ViewController context and `Marionette.templateHelpers` to the view-controller template
        mixinTemplateHelpers: function(target) {
            target = target || {};
            var templateHelpers = this.getOption('templateHelpers');

            templateHelpers = Marionette._getValue(templateHelpers, this);


            var templateContext = {
                enviroment: {
                    _app: this._app,
                    _view: this,
                    _channel: this.channel
                },
                templateHelpers: templateHelpers,
                context: this.context, // TODO: Mirar bien
                serializedData: target
            };

            return templateContext;
        },

        addComponent: function(name, instance) {
            this.components[name] = this.components[name] || [];
            this.components[name].push(instance);
        },

        _destroyComponents: function() {
            var component;

            _.each(this.components, function(componentArray) {
                for (var i = 0; i < componentArray.length; i++) {
                    component = componentArray[i];

                    if (component && _.isFunction(component.destroy)) {
                        component.destroy();
                    }

                    delete componentArray[i];
                }
            });
        },

        //Override Marionette._delegateDOMEvents to add Components listeners
        _delegateDOMEvents: function(eventsArg) {
            var events = Marionette._getValue(eventsArg || this.events, this),
                componentEvents = JSkeleton.Utils.extractComponentEvents(events);

            events = _.omit(events, _.keys(componentEvents));

            this._componentEvents = componentEvents;

            return Marionette.View.prototype._delegateDOMEvents.call(this, events);
        },

        //Bind event to the specified component using listenTo method
        _delegateComponentEvent: function(component, event, handlerName) {
            var handler = this[handlerName];

            if (!handler || typeof handler !== 'function') {
                throw new Error('You have to define a valid method as handler of event view');
            }

            if (component && component.isDestroyed !== true) {
                this.listenTo(component, event, handler);
            }
        },

        //Bind off event to the specified component using off method
        _undelegateComponentEvent: function(component, event, handler) {
            this.off(event, handler);
        },

        unbindComponents: function() {
            var self = this,
                components = this.components;

            _.each(this._componentEvents, function(method, eventName) {
                var componentName = JSkeleton.Utils.normalizeComponentName(eventName),
                    eventType = JSkeleton.Utils.normailzeEventType(eventName),
                    componentArray = components[componentName];

                _.each(componentArray, function(component) {

                    self._undelegateComponentEvent(component, eventType, method);

                });
            });
        },

        //Attach events to the controller-view components to listenTo those events with `@component.ComponentName` event notation
        bindComponents: function() {
            var self = this,
                components = this.components;

            _.each(this._componentEvents, function(method, eventName) {
                //Get component name from event hash `@component.ComponentName`
                var componentName = JSkeleton.Utils.normalizeComponentName(eventName),
                    //Get event name from event hash `click @component.ComponentName`
                    eventType = JSkeleton.Utils.normailzeEventType(eventName),
                    //Get the component instance by component name
                    componentArray = components[componentName];

                _.each(componentArray, function(component) {
                    self._delegateComponentEvent(component, eventType, method);
                });
            });
        },

        render: function() {
            this._destroyComponents();

            JSkeleton.LayoutView.prototype.render.apply(this, arguments);

            this.unbindComponents();

            this.bindComponents();

            return this;
        },

        destroy: function() {
            this._destroyComponents();
            return Marionette.LayoutView.prototype.destroy.apply(this, arguments);
        }
    });
