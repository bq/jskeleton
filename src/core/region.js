'use strict';

/*globals JSkeleton, Backbone, Marionette, _ */

/* jshint unused: false */

//## JSkeleton.Region
JSkeleton.Region = Marionette.Region.extend({

    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `onDestroy` method on your view, just after showing
    // or just before destroying the view, respectively.
    // The `preventDestroy` option can be used to prevent a view from
    // the old view being destroyed on show.
    // The `forceShow` option can be used to force a view to be
    // re-rendered if it's already shown in the region.
    show: function(view, options) {

        if (!this._ensureElement()) {
            return;
        }

        this._ensureViewIsIntact(view);

        var showOptions = options || {};
        var isDifferentView = view !== this.currentView;
        var preventDestroy = !!showOptions.preventDestroy;
        var forceShow = !!showOptions.forceShow;
        var renderOptions = showOptions.renderOptions || {};

        // We are only changing the view if there is a current view to change to begin with
        var isChangingView = !!this.currentView;

        // Only destroy the current view if we don't want to `preventDestroy` and if
        // the view given in the first argument is different than `currentView`
        var _shouldDestroyView = isDifferentView && !preventDestroy;

        // Only show the view given in the first argument if it is different than
        // the current view or if we want to re-show the view. Note that if
        // `_shouldDestroyView` is true, then `_shouldShowView` is also necessarily true.
        var _shouldShowView = isDifferentView || forceShow;

        if (isChangingView) {
            this.triggerMethod('before:swapOut', this.currentView, this, options);
        }

        if (this.currentView) {
            delete this.currentView._parent;
        }

        if (_shouldDestroyView) {
            this.empty();

            // A `destroy` event is attached to the clean up manually removed views.
            // We need to detach this event when a new view is going to be shown as it
            // is no longer relevant.
        } else if (isChangingView && _shouldShowView) {
            this.currentView.off('destroy', this.empty, this);
        }

        if (_shouldShowView) {

            // We need to listen for if a view is destroyed
            // in a way other than through the region.
            // If this happens we need to remove the reference
            // to the currentView since once a view has been destroyed
            // we can not reuse it.
            view.once('destroy', this.empty, this);

            view.render(renderOptions);

            view._parent = this;

            if (isChangingView) {
                this.triggerMethod('before:swap', view, this, options);
            }

            this.triggerMethod('before:show', view, this, options);
            Marionette.triggerMethodOn(view, 'before:show', view, this, options);

            if (isChangingView) {
                this.triggerMethod('swapOut', this.currentView, this, options);
            }

            // An array of views that we're about to display
            var attachedRegion = Marionette.isNodeAttached(this.el);

            // The views that we're about to attach to the document
            // It's important that we prevent _getNestedViews from being executed unnecessarily
            // as it's a potentially-slow method
            var displayedViews = [];

            var triggerBeforeAttach = showOptions.triggerBeforeAttach || this.triggerBeforeAttach;
            var triggerAttach = showOptions.triggerAttach || this.triggerAttach;

            if (attachedRegion && triggerBeforeAttach) {
                displayedViews = this._displayedViews(view);
                this._triggerAttach(displayedViews, 'before:');
            }

            this.attachHtml(view);
            this.currentView = view;

            if (attachedRegion && triggerAttach) {
                displayedViews = this._displayedViews(view);
                this._triggerAttach(displayedViews);
            }

            if (isChangingView) {
                this.triggerMethod('swap', view, this, options);
            }

            this.triggerMethod('show', view, this, options);
            Marionette.triggerMethodOn(view, 'show', view, this, options);

            return this;
        }

        return this;
    }
});

Marionette.RegionManager.prototype.addRegion = function(name, definition) {
    var region;

    if (definition instanceof JSkeleton.Region) {
        region = definition;
    } else {
        region = Marionette.Region.buildRegion(definition, JSkeleton.Region);
    }

    this.triggerMethod('before:add:region', name, region);

    region._parent = this;

    this._store(name, region);

    this.triggerMethod('add:region', name, region);

    return region;
};