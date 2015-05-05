'use strict';
/*globals require,define,describe,it, Jskeleton, before */
/* jshint unused: false */
describe('In view-controller ', function() {
    var sandbox,
        stubNewFactory,
        ViewController,
        viewController,
        viewControllerOptions,
        createViewController,
        mainRegion;

    before(function() {
        sandbox = sinon.sandbox.create();

        stubNewFactory = sandbox.stub(Jskeleton.factory, 'new');

        ViewController = Jskeleton.ViewController;

        createViewController = function(options) {
            return new ViewController(options);
        };

        mainRegion = new Backbone.Marionette.Region({
            el: 'body'
        });

        viewControllerOptions = {
            app: {},
            channel: {},
            region: {}
        };
    });

    it('it exists and extends an object', function() {
        expect(ViewController).to.be.a('function');
        expect(ViewController.prototype).to.be.an('object');
    });

    it('it has all namespace properties', function() {
        expect(ViewController.prototype).to.include.keys(
            'constructor',
            '_ensureOptions',
            'mixinTemplateHelpers',
            'addComponent',
            'destroy',
            '_destroyComponents',
            '_delegateComponentEvent',
            '_undelegateComponentEvent',
            'unbindComponents',
            'bindComponents',
            'render'
        );
    });

    it('we can create a new view-controller object', function() {
        expect(createViewController.bind(this, viewControllerOptions)).to.not.throw(Error);
        expect(createViewController(viewControllerOptions)).to.be.an('object');
    });

    it('throws errors if we try to create a new view-controller with any option missing', function() {
        expect(createViewController).to.throw(Error);

        expect(createViewController.bind(this, {
            app: {},
            channel: {}
        })).to.throw(Error);

        expect(createViewController.bind(this, {
            app: {},
            region: {}
        })).to.throw(Error);

        expect(createViewController.bind(this, {
            region: {},
            channel: {}
        })).to.throw(Error);

    });

    describe('When we have a view-controller object', function() {
        var ViewComponent,
            viewComponent,
            OtherViewComponent,
            otherViewComponent,
            viewController,
            viewComponentSpyEvent,
            otherViewComponentSpyEvent,
            viewControllerSpyEvent;

        beforeEach(function() {

            ViewComponent = Jskeleton.ItemView.extend({
                template: '<strong id="view-action"> Test Title </strong>',
                events: {
                    'click #view-action': 'onActionClicked',
                },
                onActionClicked: function(event) {
                    this.trigger('buy', event);
                }
            });

            OtherViewComponent = Jskeleton.ItemView.extend({
                template: '<strong id="other-view-action"> Other Test Title </strong>',
                events: {
                    'keypress #other-view-action': 'onActionKeypress',
                },
                onActionKeypress: function(event) {
                    this.trigger('sell', event);
                }
            });

            ViewController = Jskeleton.ViewController.extend({
                events: {
                    'buy @component.viewComponent': 'onLink',
                    'sell @component.otherViewComponent': 'onLink'
                },
                template: 'viewComponent: {{@component name="viewComponent"}}' +
                    'otherViewComponent: {{@component name="otherViewComponent"}}',
                onLink: function(event) {},
            });

            viewComponentSpyEvent = sinon.spy(ViewComponent.prototype,
                'onActionClicked');

            viewComponent = new ViewComponent();

            stubNewFactory.withArgs('viewComponent').returns(viewComponent);

            otherViewComponentSpyEvent = sinon.spy(OtherViewComponent.prototype,
                'onActionKeypress');

            otherViewComponent = new OtherViewComponent();

            stubNewFactory.withArgs('otherViewComponent').returns(otherViewComponent);

            viewController = createViewController(viewControllerOptions);

            viewControllerSpyEvent = sinon.spy(viewController, 'onLink');

        });

        it('we can add components', function() {
            expect(viewController.components).to.be.an('object');

            viewController.addComponent('ViewComponent', viewComponent);
            expect(Object.keys(viewController.components)).to.have.length.above(0);

            viewController.addComponent('OtherViewComponent', otherViewComponent);
            expect(Object.keys(viewController.components)).to.have.length.above(1);
        });

        describe('When we render it in a region', function() {
            var componentListeners;

            beforeEach(function() {
                mainRegion.show(viewController);
            });

            it('it is rendered', function() {
                expect(viewController.isRendered).to.be.true;
            });

            it('all its components are rendered', function() {
                expect(viewComponent.isRendered).to.be.true;
                expect(otherViewComponent.isRendered).to.be.true;
            });

            it('has all component events attached to it', function() {
                componentListeners = [];

                _.each(viewController._listeningTo, function(listener) {
                    componentListeners.push(listener._listenId);
                });

                _.each(viewController.components, function(classComponents) {
                    _.each(classComponents, function(component) {
                        expect(_.contains(componentListeners, component._listenId))
                            .to.be.true;
                    });
                });
            });

            it('events run properly', function() {
                $('#view-action').click();
                $('#other-view-action').keypress();

                expect(viewComponentSpyEvent.calledOnce).to.be.equal(true);
                expect(otherViewComponentSpyEvent.calledOnce).to.be.equal(true);
                expect(viewControllerSpyEvent.calledTwice).to.be.equal(true);
            });

            it('refreshing the components they are resetted', function() {
                var AnotherViewComponent = Jskeleton.ItemView.extend({
                    template: '<strong id="another-view-action"> another Test Title </strong>',
                });

                var anotherViewComponent = new AnotherViewComponent();

                stubNewFactory.withArgs('anotherViewComponent').returns(anotherViewComponent);

                viewController.template = 'refresh viewComponent: {{@component name="viewComponent"}}, ' +
                    'otherViewComponent: {{@component name="anotherViewComponent"}}';

                viewComponent = new ViewComponent();

                stubNewFactory.withArgs('viewComponent').returns(viewComponent);

                viewController.render();

                expect(otherViewComponent.isDestroyed).to.be.true;

                var renderedViewsCounter = 0;

                _.each(viewController.components, function(classComponents) {
                    _.each(classComponents, function(component) {
                        if (component && component.isRendered) {
                            renderedViewsCounter += 1;
                        }
                    });
                });

                expect(renderedViewsCounter).to.be.equal(2);

            });

            it('it can be destroyed', function() {
                expect(viewController.isDestroyed).to.be.false;

                viewController.destroy();
                expect(viewController.isDestroyed).to.be.true;

                _.each(viewController.components, function(componentArray) {
                    expect(componentArray[0]).to.be.undefined;
                });
            });
        });
    });


});
