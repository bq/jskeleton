    'use strict';

    /*globals Jskeleton, Marionette */

    Jskeleton.ViewController = Marionette.LayoutView.extend({
        constructor: function(options) { //inyectar app, channel, region
            options = options || {};
            this._ensureOptions(options);
            this._app = options.app;
            this.channel = options.channel;
            this.region = options.region;
            this.service = options.service;
            this.context = {};
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
        },
        _ensureOptions: function(options) {
            if (!options.app) {
                throw new Error('El view-controller necesita tener la referencia a su application');
            }
            if (!options.channel) {
                throw new Error('El view-controller necesita tener un canal');
            }
            if (!options.region) { // mirarlo
                throw new Error('El view-controller necesita tener una region específica');
            }
        },
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
        }
    });