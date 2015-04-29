/*globals require,define,describe,it, Jskeleton, before, beforeEach, after, afterEach */
/* jshint unused: false */
describe('In Component module', function () {

    var sandbox = sinon.sandbox.create(),
        stubNewFactory,
        modelComponent,
        ViewController,
        ViewComponent,
        LayoutComponent,
        renderSpy;


    beforeEach(function () {

        modelComponent = new Backbone.Model({
            title: 'Component HtmlBars'
        });

        ViewComponent = Backbone.Marionette.ItemView.extend({
            template: '<strong> Test Title: </strong> <span class="title">{{title}}</span>',
            model: modelComponent,
            onRender: function(){
            }
        });

        ViewController = Jskeleton.ViewController.extend({
            template: "{{@component name='ViewComponent'}}"
        });


        LayoutComponent = Backbone.Marionette.LayoutView.extend({
          template: '<div class="content"></div>',
          regions: {
            content: ".content"
          }
        });

        renderSpy = sinon.spy(ViewComponent.prototype, 'onRender');

        stubNewFactory = sandbox.stub(Jskeleton.factory, 'new', function () {
            return new ViewComponent();
        }).withArgs('ViewComponent');

    });

    afterEach(function () {
        sandbox.restore();
    });


    describe('when define a new component', function () {

        var layout,
            viewController;


        beforeEach(function(){
            layout = new LayoutComponent();
            var mockApp = {
                app: 'appMock',
                channel: 'channelMock',
                region: 'regionMock'
            };

            viewController = new ViewController(mockApp);

            layout.render();
            layout.content.show(viewController);
        });

        it('and render this new component', function () {
            expect(renderSpy.calledOnce).to.be.equal(true);
        });


        it('and model is rendered', function () {
            expect(layout.$el.find('.title').length).to.be.above(0);
            expect(layout.$el.find('.title')[0].innerHTML).to.be.equal(modelComponent.get('title'));
        });

    });

});
