/*globals require,define,describe,it, JSkeleton, before, beforeEach, after, afterEach */

/* jshint unused: false */

describe('Application object with declared events', function() {

    var sandbox = sinon.sandbox.create();

    after(function() {
        sandbox.restore();
    });

    before(function() {

        this.ViewController = JSkeleton.ViewController.extend({
            onRouteExample: function() {

            },
            template: '<div></div>',
        });


        this.Application = JSkeleton.Application.extend({
            waitBeforeStartHooks: false,
            el: 'body',
            routes: {
                'route/example': {
                    eventListener: 'example:event',
                    viewController: this.ViewController
                }
            },
            regions: {
                mainRegion: 'body'
            }
        });

        this.globalChannel = Backbone.Radio.channel('global');

        this.app = new this.Application();

        this.viewController = new this.ViewController({
            app: this.app
        });

        this.navigationSpy = sandbox.spy(this.app, '_navigateTo');
        this.factoryStub = sandbox.stub(this.app, '_getViewControllerInstance');

        this.factoryStub.returns(this.viewController);
        this.viewControllerRenderSpy = sandbox.spy(this.viewController, 'render');
        this.viewControllerRouteHandlerSpy = sandbox.spy(this.viewController, 'onRouteExample');
    });

    afterEach(function() {
        this.navigationSpy.reset();
    });

    it('should not listen the events in global channel before start', function() {
        this.globalChannel.trigger('example:event');
        expect(this.navigationSpy.called).to.be.equal(false);
    });

    describe('when application starts', function() {

        before(function() {
            this.app.start();
            this.globalChannel.trigger('example:event');
        });

        it('should listen the events in global channel', function() {
            expect(this.navigationSpy.calledOnce).to.be.equal(true);
        });

        it('should process a render method on the view-controller when the global event is triggered', function() {
            expect(this.viewControllerRenderSpy.calledOnce).to.be.equal(true);
        });

        it('should process a handler method on the view-controller when the global event is triggered', function() {
            expect(this.viewControllerRouteHandlerSpy.calledOnce).to.be.equal(true);
        });
    });

    describe('when application stop', function() {

        before(function() {
            this.app.stop();
        });

        it('should not listen the events in global channel when application stops', function() {
            this.globalChannel.trigger('example:event');
            expect(this.navigationSpy.called).to.be.equal(false);
        });

    });

});
