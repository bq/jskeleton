/*globals require,define,describe,it, JSkeleton, before, beforeEach, after, afterEach */
/* jshint unused: false */
describe('In Component module', function() {

    var sandbox = sinon.sandbox.create(),
        modelTest,
        ViewComponent,
        ViewListComponent,
        ViewControllerComponent,
        ViewController;

    beforeEach(function() {

        var ModelComponent = Backbone.Model.extend({
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

        ViewComponent = JSkeleton.ItemView.extend({
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

        var stubNewFactory = sandbox.stub(JSkeleton.factory, 'new', function() {
            return new ViewComponent();
        }).withArgs('ViewComponent');

        ViewListComponent = ViewComponent.extend({
            template: '<div class="book-list"><span>Book list:</span></div>',
            onRender: function() {}
        });

        ViewControllerComponent = JSkeleton.ViewController.extend({
            context: {
                model: 'modelComponent'
            },
            events: {
                'return @component.ViewComponent': 'onEventComponent'
            },
            onEventComponent: function() {}
        });

        ViewController = JSkeleton.ViewController.extend({
            regions: {
                content: '.content'
            }
        });        
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('when define a new component ', function () {

        var MainErrorApp;

        beforeEach(function(){
            var templateErrorClassName ='{{@component model=context.model}}';
            var ChildAppError = JSkeleton.ChildApplication.extend({
                routes: {
                    '': {
                        viewControllerClass: ViewControllerComponent,
                        template: templateErrorClassName
                    }
                }
            });
            MainErrorApp = JSkeleton.Application.extend({
                viewController: {
                    viewControllerClass: ViewController,
                    template: '<div class="content"></div>'
                },
                applications: {
                    'chilApp': {
                        applicationClass: ChildAppError,
                        region: 'content'
                    }
                }
            });
        });

        it('but without Class Name Component', function(){
            var error = 'You must define a Component Class Name.';
            var testErrorApp = new MainErrorApp();

            expect(function () {
                return testErrorApp.start();
            }).to.throw(error);
        });
    });

    describe('when define a new component,', function() {
        var renderSpy,
            eventComponentSpy,
            eventViewControllerSpy,
            eventChannelSpy,
            MainApp,
            testApp;

        beforeEach(function() {
            renderSpy = sinon.spy(ViewComponent.prototype, 'onRender');
            eventComponentSpy = sinon.spy(ViewComponent.prototype, 'onActionBuy');
            eventViewControllerSpy = sinon.spy(ViewControllerComponent.prototype, 'onEventComponent');
            eventChannelSpy = sinon.spy(ViewListComponent.prototype, 'onRender');

            var templateCorrectComponent = '{{@component name="ViewComponent" model=context.model}}';
            var ChildApp = JSkeleton.ChildApplication.extend({
                routes: {
                    '': {
                        viewControllerClass: ViewControllerComponent,
                        template: templateCorrectComponent
                    },

                    'book/list': {
                        viewControllerClass: ViewControllerComponent,
                        template: '{{@component name="ViewListComponent"}}',
                        eventListener: 'come:back'
                    }
                }
            });

            MainApp = JSkeleton.Application.extend({
                viewController: {
                    viewControllerClass: ViewController,
                    template: '<div class="content"></div>'
                },
                applications: {
                    'chilApp': {
                        applicationClass: ChildApp,
                        region: 'content'
                    }
                }
            });

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