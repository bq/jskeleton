(function(root, factory) {
    'use strict';
    /*globals require,define */
    /* jshint unused: false */

    if (typeof define === 'function' && define.amd) {
        define(['jquery',
            'underscore',
            'backbone',
            'backbone.marionette',
            'es6-promise',
            'backbone.radio'
        ], function($, _, Backbone, Marionette, Promise) {
            Promise.polyfill();
            return factory.call(root, root, $, _, Backbone, Marionette);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            Promise = require('es6-promise'),
            radio = require('backbone.radio');

        Backbone.$ = $;
        Promise.polyfill();

        var Marionette = require('backbone.marionette'),
            JSkeleton = factory(root, $, _, Backbone, Marionette);

        module.exports = JSkeleton;
    } else if (root !== undefined) {
        root.JSkeleton = factory.call(root, root, root.$, root._, root.Backbone, root.Marionette);
    }

})(this, function(root, $, _, Backbone, Marionette) {
    'use strict';
    /*globals require,requireModule */
    /* jshint unused: false */

    //  @include ../../lib/htmlbars/loader.js
    //  @include ../../lib/htmlbars/dom-helper.amd.js
    //  @include ../../lib/htmlbars/htmlbars-compiler.amd.js
    //  @include ../../lib/htmlbars/htmlbars-runtime.amd.js

    var JSkeleton = root.JSkeleton || {};

    JSkeleton.htmlBars = {
        compiler: requireModule('htmlbars-compiler'),
        DOMHelper: requireModule('dom-helper').default,
        hooks: requireModule('htmlbars-runtime').hooks,
        render: requireModule('htmlbars-runtime').render
    };

    JSkeleton.Promise = Promise;

    //  @include ../core/renderer.js
    //  @include ../helpers/html-bars.js
    //  @include ../helpers/component.js
    //  @include ../helpers/if.js
    //  @include ../helpers/each.js
    //  @include ../utils/utils.js
    //  @include ../utils/extension.js
    //  @include ../utils/factory.js
    //  @include ../utils/common.js
    //  @include ../utils/behaviors.js
    //  @include ../core/model.js
    //  @include ../core/collection.js
    //  @include ../core/modelStore.js
    //  @include ../core/region.js
    //  @include ../core/store.js
    //  @include ../core/di.js
    //  @include ../core/router.js
    //  @include ../core/service.js
    //  @include ../core/application.js
    //  @include ../core/view.js
    //  @include ../core/item-view.js
    //  @include ../core/layout-view.js
    //  @include ../core/collection-view.js
    //  @include ../core/composite-view.js
    //  @include ../core/view-controller.js

    JSkeleton.di = new JSkeleton.Di();
    JSkeleton.extension = new JSkeleton.Extension();

    JSkeleton.globalChannel = Backbone.Radio.channel('global');

    return JSkeleton;

});