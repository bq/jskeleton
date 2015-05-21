'use strict';

/*globals Marionette, JSkeleton, _*/

/* jshint unused: false */

JSkeleton.CollectionView = Marionette.CollectionView.extend({

    constructor: function(options) {
        this.once('render', this._initialEvents);

        this._initChildViewStorage();

        JSkeleton.View.apply(this, arguments);

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
    },

    getChildView: function(child) {
        var childView = this.getOption('childView');

        //The child view is a `JSkeleton.Factory` key string reference
        if (typeof childView === 'string') {
            childView = JSkeleton.factory.getClass(childView);
        }

        if (!childView) {
            throw new Marionette.Error({
                name: 'NoChildViewError',
                message: 'A "childView" must be specified'
            });
        }
        return childView;
    }

}, {
    factory: JSkeleton.Utils.FactoryAdd
});
