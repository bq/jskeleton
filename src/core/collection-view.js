'use strict';

/*globals Marionette, Jskeleton*/

/* jshint unused: false */

Jskeleton.CollectionView = Marionette.CollectionView.extend({
    constructor: function(options) {

        this.once('render', this._initialEvents);

        this._initChildViewStorage();

        Jskeleton.View.prototype.constructor.apply(this, arguments);

        this.on('show', this._onShowCalled);

        this.initRenderBuffer();
    }
});