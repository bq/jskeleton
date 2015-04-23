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


    var Jskeleton = root.Jskeleton || {};

    Jskeleton.htmlBars = {
        compiler: requireModule('htmlbars-compiler'),
        DOMHelper: requireModule('dom-helper').default,
        hooks: requireModule('htmlbars-runtime').hooks,
        render: requireModule('htmlbars-runtime').render
    };

    //  @include ../core/renderer.js
    //  @include ../helpers/html-bars.js
    //  @include ../utils/hook.js
    //  @include ../utils/factory.js
    //  @include ../core/router.js
    //  @include ../core/service.js
    //  @include ../core/application.js
    //  @include ../core/view-controller.js


    return Jskeleton;

});
