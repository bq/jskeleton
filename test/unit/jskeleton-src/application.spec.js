/*globals require,define,describe,it, JSkeleton, before, beforeEach, after, afterEach */

/* jshint unused: false */

describe('Application object', function() {

    var sandbox = sinon.sandbox.create();

    before(function() {
        this.Application = JSkeleton.Application.extend({
            regions: {
                region1: '.region1',
                region2: '.region2'
            }
        });

        $('body').append('<div class=".region1"> </div>');
        $('body').append('<div class=".region2"> </div>');
    });

    afterEach(function() {
        sandbox.restore();
    });

    after(function() {
        $('.region1').remove();
        $('.region2').remove();
    });

    it('should be and JSkeleton Application class definition', function() {
        expect(JSkeleton).to.have.property('Application').with.length(1);
    });

    describe('with no extended properties', function() {

        before(function() {
            this.application = new this.Application();
            this.triggerSpy = sinon.spy(this.application, 'trigger');
        });

        it('should be and JSkeleton Application instance', function() {
            expect(this.application).to.have.property('start');
        });

        it('should have applications property', function() {
            expect(this.application).to.have.property('_childApplications');
        });

        it('can has a root region with a default "body" el reference', function() {
            expect(this.application.main).to.be.instanceof(JSkeleton.Region);
            expect(this.application.main.el).to.be.equal(this.application.defaultEl);
        });

        it('can be started', function() {
            this.application.start();
        });

        it('should notify me before the start', function() {
            expect(this.triggerSpy).to.have.been.calledWith('before:start');
        });

        it('should notify me after the app has started', function() {
            expect(this.triggerSpy).to.have.been.calledWith('start');
        });

    });

    describe('with custom regions', function() {

        before(function() {
            this.application = new this.Application();
        });

        after(function() {});

        it('create the regions when the application is instantiated', function() {
            expect(this.application.region1).to.be.instanceof(JSkeleton.Region);
            expect(this.application.region1.el).to.be.equal('.region1');
            expect(this.application.region2).to.be.instanceof(JSkeleton.Region);
            expect(this.application.region2.el).to.be.equal('.region2');
        });

    });

    describe('with defined child applications', function() {

        before(function() {

            this.ChildApp = JSkeleton.Application.extend({});

            this.ChildAppNotStart = JSkeleton.Application.extend({
                startWithParent: false
            });

            // this.notStartChilldAppSpy = sandbox.spy(this.ChildAppNotStart.prototype, 'start');

            this.AppWithSubApps = this.Application.extend({
                applications: {
                    'childAppStart': {
                        applicationClass: this.ChildApp,
                        region: 'region1'
                    },
                    'childAppNotStart': {
                        applicationClass: this.ChildAppNotStart,
                        startWithParent: false,
                        region: 'region2'
                    }
                }
            });

            this.application = new this.AppWithSubApps();

            this.childApp = new this.ChildApp({
                parentApplication: this.application
            });

            this.childAppNotStart = new this.ChildAppNotStart({
                parentApplication: this.application
            });

            this.factoryStub = sandbox.stub(this.application, 'getInstance');

            this.factoryStub.withArgs(this.ChildApp).returns(this.childApp);
            this.factoryStub.withArgs(this.ChildAppNotStart).returns(this.childAppNotStart);

            this.childAppStartSpy = sandbox.spy(this.childApp, 'start');
            this.childAppNotStartSpy = sandbox.spy(this.childAppNotStart, 'start');

            this.application.start();
        });

        it('can get all it`s child applications instances by name', function() {
            this.childAppStart = this.application.getChildApplication('childAppStart');
            this.childAppNotStart = this.application.getChildApplication('childAppNotStart');

            expect(this.childAppStart).to.be.instanceof(this.ChildApp);
            expect(this.childAppNotStart).to.be.instanceof(this.ChildAppNotStart);
        });

        it('start it`s child applications when it starts', function() {
            expect(this.childAppStartSpy.calledOnce).to.be.equal(true);
        });

        it('doesn`t start it`s child applications if startWithParent option is set to false', function() {
            expect(this.childAppNotStartSpy.called).to.be.equal(false);
        });

    });

    describe('with an application view-controller', function() {

        before(function() {
            this.ViewController = JSkeleton.ViewController.extend({
                template: '<div class="content"></div> <div class="content2"></div>',
                render: function() {},
                regions: {
                    content: '.content',
                    content2: '.content2'
                }
            });

            this.customTemplate = '<div> <div class="content"></div> </div> <div class="content2"></div>';

            this.Application = JSkeleton.Application.extend({
                waitBeforeStartHooks: false,
                layout: this.ViewController
            });

            this.viewController = new this.ViewController({
                app: {}
            });

            this.renderSpy = sandbox.spy(this.viewController, 'render');

            this.factoryStub = sandbox.stub(this.Application.prototype, 'getInstance');

            this.factoryStub.withArgs(this.ViewController).returns(this.viewController);

            this.application = new this.Application();

            this.application.start();
        });

        it('have a layout instance of the specified Layout class', function() {
            expect(this.application._layout).to.be.instanceof(this.ViewController);
        });

        it('render the layout when the application is created', function() {
            expect(this.renderSpy.calledOnce).to.be.equal(true);
        });

        it('has the layout regions as own properties', function() {
            expect(this.viewController).to.include.keys('content', 'content2');
        });

        it('the layout template can be override', function() {

            this.ApplicationTemplate = JSkeleton.Application.extend({
                waitBeforeStartHooks: false,
                layout: {
                    layoutClass: this.ViewController,
                    template: this.customTemplate
                }
            });

            this.factorySpy = sandbox.spy(this.ApplicationTemplate.prototype, 'getInstance');

            this.app = new this.ApplicationTemplate();

            this.app.start();

            expect(this.app._layout.template).to.be.equal(this.customTemplate);

        });

    });

});