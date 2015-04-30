/*globals require,define,describe,it, Jskeleton, before */
/* jshint unused: false */
describe('In view-controller ', function() {
    'use strict';

    var sandbox,
        ViewController,
        viewController;

    before(function(){
        sandbox = sinon.sandbox.create();

        ViewController = Jskeleton.ViewController;
    });


    afterEach(function(){
        sandbox.restore();
    });

    it('it exists and extends an object', function(){
        expect(ViewController).to.be.a('function');
        expect(ViewController.prototype).to.be.an('object');
    });

    it('it has all namespace properties', function(){
        expect(ViewController.prototype).to.include.keys(
            'constructor',
            '_ensureOptions',
            'mixinTemplateHelpers',
            'addComponent',
            'destroy'
            );
    });

    describe('When we create a new view-controller', function(){
        var viewControllerOptions,
            badControllerOptions,
            createViewController;

        before(function(){
            createViewController = function(options){
                return new ViewController(options);
            };

            viewControllerOptions = {
                app: {},
                channel: {},
                region: {}
            };
        });

        it('we can create a new view-controller object', function(){
            expect(createViewController.bind(this, viewControllerOptions)).to.not.throw(Error);
            expect(createViewController(viewControllerOptions)).to.be.an('object');
        });

        it('throws errors if any option is missing', function(){
            expect(createViewController).to.throw(Error);

            badControllerOptions = {
                app: {},
                channel: {}
            };
            expect(createViewController.bind(this, badControllerOptions)).to.throw(Error);
        });

        describe('When we have a view-controller object', function(){
            var modelComponent,
                ViewComponent,
                viewComponent,
                viewController;

            before(function(){
                modelComponent = new Backbone.Model({
                    title: 'Component HtmlBars'
                });

                ViewComponent = Backbone.Marionette.ItemView.extend({
                    template: '<strong> Test Title: </strong> <span class="title">{{title}}</span>',
                    model: modelComponent,
                    onRender: function(){
                    }
                });

                viewComponent = new ViewComponent();

                viewController = createViewController(viewControllerOptions);
            });

            it('we can add components', function(){
                expect(viewController.components).to.be.an('object');

                viewController.addComponent('modelComponent', modelComponent);
                expect(Object.keys(viewController.components)).to.have.length.above(0);

                viewController.addComponent('viewComponent', viewComponent);
                //expect(Object.keys(viewController.components)).to.have.length.above(1);
            });

            describe('When we render it in a region', function(){
                it('it is rendered', function(){

                });

                it('all its components are rendered', function(){

                });
            });

            it('it can be destroyed', function(){
                viewController.destroy();
                //expect(viewController.isRendered).to.be.falsy
                //console.log(viewController.isRendered);
                //-->each: components
            });

        });

    });


});
