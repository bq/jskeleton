/*globals require,define,describe,it, Jskeleton, before */
/* jshint unused: false */

var _ = require('underscore');
var Backbone = require('backbone');
var factory = Jskeleton.factory;

var myBackboneView = Backbone.View.extend({});
factory.add('myBackboneView', myBackboneView);

describe('In Factory module', function() {

    var sandbox = sinon.sandbox.create();

    afterEach(function() {
        sandbox.restore();
    });

    it('exists and is an object', function() {
        expect(factory).to.be.an('object');
    });

    it('has all namespace properties', function() {
        expect(factory).to.include.keys(
            'prototypes',
            'singletons',
            'add',
            'new',
            'singleton',
            'get',
            'getAll'
        );
    });

    describe('When register an object', function() {

        it('we can get it', function() {
            expect(factory.get('myBackboneView')).to.be.equal(myBackboneView);
        });

        it('we can instantiate', function() {
            var myBackboneModel = Backbone.Model.extend({});
            expect(factory.add('myBBModel', myBackboneModel));
            expect(factory.new('myBBModel')).to.be.an('object');
        });

        it('list all objects', function() {
            var objects = factory.getAll();
            expect(objects.myBackboneView).to.be.an('function');
            expect(objects.Model).to.be.an('function');
            expect(objects.Collection).to.be.an('function');
            expect(_.size(objects)).to.be.equal(4);
        });

        describe('When create a singleton object', function() {

            it('if not exist, is created once', function() {

                var spy = sandbox.spy(factory, 'new');

                expect(factory.singletons.Model).to.be.equal(undefined);
                var model1 = factory.singleton('Model', {
                    key: 'value'
                });
                expect(factory.singletons.Model).to.be.equal(model1);
                expect(model1).to.be.an('object');
                expect(model1.get('key')).to.be.equal('value');

                var model2 = factory.singleton('Model', {
                    key: 'value2'
                });
                expect(factory.singletons.Model).to.be.equal(model1);
                expect(model1).to.be.an('object');
                expect(model1).to.be.equal(model2);
                expect(model1.get('key')).to.be.equal('value');
                expect(model2.get('key')).to.be.equal('value');

                expect(spy.calledOnce).to.be.equal(true);

                factory.singleton('Model', {
                    key: 'value2'
                });
                factory.singleton('Model', {
                    key: 'value2'
                });
                factory.singleton('Model', {
                    key: 'value2'
                });
                expect(spy.calledOnce).to.be.equal(true);
            });

        });

    });

    describe('When object is not registered', function() {
        it('return error', function() {
            expect(function() {
                factory.new('nonexistBackboneObject');
            }).to.throw('UndefinedFactoryObject - nonexistBackboneObject');
        });
        it('return error', function() {
            expect(function() {
                factory.new('nonexistBackboneView');
            }).to.throw('UndefinedFactoryObject - nonexistBackboneView');
        });
    });

    describe('Default', function() {
        it('we can instantiate Backbone models', function() {
            var myBackboneModel = Backbone.Model.extend({});
            expect(factory.add('myBackboneModel', myBackboneModel));
            expect(factory.new('myBackboneModel')).to.be.an('object');
        });
        it('we can instantiate Backbone collections', function() {
            var myBackboneColecction = Backbone.Collection.extend({});
            expect(factory.add('myBackboneColecction', myBackboneColecction));
            expect(factory.new('myBackboneColecction')).to.be.an('object');
        });
    });

});
