(function(root, factory) {
    'use strict';
    /*globals require,define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['jquery',
            'underscore',
            'backbone',
            'backbone.marionette',
            'handlebars',
            'backbone.radio'
        ], function($, _, Backbone, Marionette, Handlebars) {
            return factory.call(root, root, $, _, Backbone, Marionette, Handlebars);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            Handlebars = require('handlebars'),
            radio = require('backbone.radio');

        Backbone.$ = $;

        var Marionette = require('backbone.marionette'),
            Jskeleton = factory(root, $, _, Backbone, Marionette, Handlebars);

        module.exports = Jskeleton;
    } else if (root !== undefined) {
        root.Jskeleton = factory.call(root, root, root.$, root._, root.Backbone, root.Marionette, root.Handlebars);
    }

})(this, function(root, $, _, Backbone, Marionette, Handlebars) {
    'use strict';
    /*globals require,requireModule */
    /* jshint unused: false */

    //  @include ../../lib/htmlbars/loader.js
    //  @include ../../lib/htmlbars/dom-helper.amd.js
    //  @include ../../lib/htmlbars/htmlbars-compiler.amd.js
    //  @include ../../lib/htmlbars/htmlbars-runtime.amd.js

    var Jskeleton = root.Jskeleton || {};

    Jskeleton.htmlBars = {
        compiler: requireModule('htmlbars-compiler'),
        DOMHelper: requireModule('dom-helper').default,
        hooks: requireModule('htmlbars-runtime').hooks,
        render: requireModule('htmlbars-runtime').render
    };

    //  @include ../core/renderer.js
    //  @include ../helpers/html-bars.js
    //  @include ../helpers/component.js
    //  @include ../utils/utils.js
    //  @include ../utils/hooks.js
    //  @include ../utils/factory.js
    //  @include ../core/di.js
    //  @include ../core/router.js
    //  @include ../core/service.js
    //  @include ../core/base-application.js
    //  @include ../core/application.js
    //  @include ../core/child-application.js
    //  @include ../core/view.js
    //  @include ../core/item-view.js
    //  @include ../core/layout-view.js
    //  @include ../core/collection-view.js
    //  @include ../core/composite-view.js
    //  @include ../core/view-controller.js

    Jskeleton.di = new Jskeleton.Di();

    return Jskeleton;

});
