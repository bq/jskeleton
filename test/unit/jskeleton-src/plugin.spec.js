/*globals require,define,describe,it, Jskeleton, before */
/* jshint unused: false */

describe('In Plugin module', function() {

    var sandbox = sinon.sandbox.create();


    before(function() {
        var self = this;

        this.spy = sinon.spy();

        this.factory = Jskeleton.factory;

        this.plugin = Jskeleton.plugin;

        this.pluginFunction = function() {
            self.spy();
        };

        this.plugin('myTestPlugin', this.pluginFunction);
    });

    after(function() {
        sandbox.restore();
    });

    it('exists and is an function', function() {
        expect(this.plugin).to.be.a('function');
    });

    it('adds plugins to the factory', function() {
        this.pluginInFactory = this.factory.get('myTestPlugin');
        expect(this.pluginInFactory).not.to.be.undefined;
        expect(this.pluginInFactory.Class).to.be.equal(this.pluginFunction);
    });

    it('plugin is not started', function() {
        expect(this.spy.called).to.be.false;
    });

    it('they can be called', function() {
        this.factory.getClass('myTestPlugin')();
        expect(this.spy.calledOnce).to.be.true;
    });

    describe('when plugin has dependencies', function() {
        before(function() {
            var self = this;
            this.MyNewBackboneView = Backbone.View.extend({});
            this.factory.add('myNewBackboneView', this.MyNewBackboneView);

            this.newSpy = sinon.spy();

            this.newPluginFunction = function(myTestPlugin) {
                self.newSpy();
            };

        });

        it('they are called when our plugin is called', function() {
            this.plugin('myNewPlugin', this.newPluginFunction);
            this.factory.getClass('myNewPlugin')();

            expect(this.spy.calledOnce).to.be.true;
            expect(this.newSpy.calledOnce).to.be.true;
            Jskeleton.di.store('myTestPlugin', undefined, {});
        });

        it.skip('they are functions', function() {

        });
    });

});