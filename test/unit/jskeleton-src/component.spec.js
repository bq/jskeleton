/*globals require,define,describe,it, Jskeleton, before, beforeEach, after, afterEach */
/* jshint unused: false */
describe('In Component module', function() {

    var sandbox = sinon.sandbox.create(),
        stubNewFactory,
        modelTest,
        ModelComponent,
        ViewComponent,
        ViewListComponent,
        ViewControllerComponent,
        MainApp,
        testApp;

    beforeEach(function() {

        ModelComponent = Backbone.Model.extend({
            title: '',
            author: ''
        });

        modelTest = new ModelComponent({
            title: 'Title Component HtmlBars',
            author: 'Author Component HtmlBars'
        });

        var templateComponent =
            '<strong> Test Title: </strong> <span class="title">{{title}}</span>' +
            '<strong> Test Author: </strong> <span class="author">{{author}}</span>' +
            '<button class="buy-action"> Buy Book </button>' +
            '<button class="return-action"> Return Book </button>' +
            '<button class="back-action"> Come Back </button>';

        ViewComponent = Jskeleton.ItemView.extend({
            template: templateComponent,
            model: modelTest,
            ui: {
                'alertContent': '.alert-content',
                'buyButton': '.buy-action',
                'returnButton': '.return-action',
                'backButton': '.back-action'
            },
            events: {
                'click @ui.buyButton': 'onActionBuy',
                'click @ui.returnButton': 'onActionReturn',
                'click @ui.backButton': 'onActionBack'
            },
            onRender: function() {},
            onActionBuy: function() {},

            onActionReturn: function() {
                this.trigger('return');
            },

            onActionBack: function() {
                this.channel.trigger('come:back');
            }
        });

        stubNewFactory = sandbox.stub(Jskeleton.factory, 'new', function() {
            return new ViewComponent();
        }).withArgs('ViewComponent');

        ViewListComponent = ViewComponent.extend({
            template: '<div class="book-list"><span>Book list:</span></div>',
            onRender: function() {}
        });

        ViewControllerComponent = Jskeleton.ViewController.extend({
            context: {
                model: 'modelComponent'
            },
            events: {
                'return @component.ViewComponent': 'onEventComponent'
            },
            onEventComponent: function() {}
        });

        var ChildApp = Jskeleton.ChildApplication.extend({
            routes: {
                '': {
                    viewControllerClass: ViewControllerComponent,
                    template: "{{@component name='ViewComponent' model=context.model}}"
                },

                'book/list': {
                    viewControllerClass: ViewControllerComponent,
                    template: "{{@component name='ViewListComponent'}}",
                    eventListener: 'come:back'
                }
            }
        });

        var LayoutComponent = Jskeleton.LayoutView.extend({
            regions: {
                content: ".content"
            }
        });

        MainApp = Jskeleton.Application.extend({
            layout: {
                layoutClass: LayoutComponent,
                template: '<div class="content"></div>'
            },
            applications: {
                'chilApp': {
                    applicationClass: ChildApp,
                    region: 'content'
                }
            }
        });

    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('when define a new component,', function() {
        var renderSpy,
            eventComponentSpy,
            eventViewControllerSpy,
            eventChannelSpy;

        beforeEach(function() {
            renderSpy = sinon.spy(ViewComponent.prototype, 'onRender');
            eventComponentSpy = sinon.spy(ViewComponent.prototype, 'onActionBuy');
            eventViewControllerSpy = sinon.spy(ViewControllerComponent.prototype, 'onEventComponent');
            eventChannelSpy = sinon.spy(ViewListComponent.prototype, 'onRender');

            testApp = new MainApp();
            testApp.start();
        });

        afterEach(function() {
            testApp.destroy();
        });

        it('it is rendered', function() {
            expect(renderSpy.calledOnce).to.be.equal(true);
        });

        it('its model is rendered', function() {
            expect(testApp.$el.find('.title').length).to.be.above(0);
            expect(testApp.$el.find('.title')[0].innerHTML).to.be.equal(modelTest.get('title'));

            expect(testApp.$el.find('.author').length).to.be.above(0);
            expect(testApp.$el.find('.author')[0].innerHTML).to.be.equal(modelTest.get('author'));
        });

        describe('it can throw events', function() {
            var button;

            it('that affects to own view', function() {
                button = testApp.$el.find('.buy-action');
                button.click();
                expect(eventComponentSpy.calledOnce).to.be.equal(true);
            });

            it('to its Controller View', function() {
                button = testApp.$el.find('.return-action');
                button.click();
                expect(eventViewControllerSpy.calledOnce).to.be.equal(true);
            });

            it.skip('using its own channel', function() {
                button = testApp.$el.find('.back-action');
                button.click();
                expect(eventChannelSpy.calledOnce).to.be.equal(true);
            });
        });
    });

});