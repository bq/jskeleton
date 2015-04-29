'use strict';

/*globals Marionette, Jskeleton, _*/

/* jshint unused: false */

Jskeleton.CollectionView = Marionette.CollectionView.extend({
    constructor: function(options) {

        this.once('render', this._initialEvents);

        this._initChildViewStorage();

        Jskeleton.View.apply(this, arguments);

        this.on('show', this._onShowCalled);

        this.initRenderBuffer();
    },
    //override Marionette method to inject dependencies (as application channel, application reference ...) into child views
    buildChildView: function(child, ChildViewClass, childViewOptions) {
        var options = _.extend({
            model: child,
            channel: this.channel,
            _app: this._app
        }, childViewOptions);


        return new ChildViewClass(options);
    }
});