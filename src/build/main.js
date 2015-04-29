(function(root, factory) {
    'use strict';
    /*globals require,define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['jquery',
            'underscore',
            'backbone',
            'backbone.marionette'
        ], function($, _, Backbone, Marionette) {
            return factory.call(root, root, $, _, Backbone, Marionette);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

        Backbone.$ = $;

        var Marionette = require('backbone.marionette'),
            Jskeleton = factory(root, $, _, Backbone, Marionette);

        module.exports = Jskeleton;
    } else if (root !== undefined) {
        root.Jskeleton = factory.call(root, root, root.$, root._, root.Backbone, root.Marionette);
    }

})(this, function(root, $, _, Backbone, Marionette) {
    'use strict';
    /*globals require,requireModule */
    /* jshint unused: false */

    //  @include ../../lib/backbone.radio/backbone.radio.js
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
    //  @include ../utils/hooks.js
    //  @include ../utils/factory.js
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


    return Jskeleton;

});