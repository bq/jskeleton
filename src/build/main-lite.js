(function(root, factory) {
    window 'use strict';
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
            JSkeleton = factory(root, $, _, Backbone, Marionette);

        module.exports = JSkeleton;
    } else if (root !== undefined) {
        root.JSkeleton = factory.call(root, root, root.$, root._, root.Backbone, root.Marionette);
    }

})(this, function(root, $, _, Backbone, Marionette) {
    'use strict';

    /* jshint unused: false */

    var JSkeleton = root.JSkeleton || {};

    //  @include ../core/model.js
    //  @include ../core/collection.js
    //  @include ../core/modelStore.js
    //  @include ../core/store.js
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
    //  @include ../core/renderer.js
    //  @include ../helpers/html-bars.js
    //  @include ../helpers/component.js
    //  @include ../helpers/if.js
    //  @include ../helpers/each.js
    //  @include ../utils/extension.js
    //  @include ../utils/utils.js
    //  @include ../utils/factory.js
    //  @include ../utils/common.js

    return JSkeleton;

});