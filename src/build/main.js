(function(root, factory) {
    'use strict';
    /*globals require,define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['jquery',
            'underscore',
            'backbone.marionette'
        ], function($, _, Marionette) {
            return factory.call(root, root, $, _, Marionette);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var $ = require('jquery'),
            _ = require('underscore'),
            Marionette = require('backbone.marionette'),
            Jskeleton = factory(root, $, _, Marionette);

        root.Jskeleton = Jskeleton;
        module.exports = Jskeleton;
    } else if (root !== undefined) {
        root.Jskeleton = factory.call(root, root, root.$, root._, root.Marionette);
    }

})(window, function(root, $, _, Marionette) {
    'use strict';
    /*globals require,requireModule */
    /* jshint unused: false */

    //  @include ../../lib/htmlbars/loader.js
    //  @include ../../lib/htmlbars/dom-helper.amd.js
    //  @include ../../lib/htmlbars/htmlbars-compiler.amd.js
    //  @include ../../lib/htmlbars/htmlbars-runtime.amd.js
    //  @include ../../lib/backbone.radio/backbone.radio.js

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