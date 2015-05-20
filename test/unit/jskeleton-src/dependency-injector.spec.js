/*globals require,define,describe,it, JSkeleton, before */
/* jshint unused: false */

describe('Dependency Injector', function() {
    'use strict';
    var sandbox = sinon.sandbox.create();

    afterEach(function() {
        sandbox.restore();
    });

    beforeEach(function() {
        this.JSkeleton = {};
        this.JSkeleton.di = new JSkeleton.Di();
    });
    // Global DI Behavior
    describe('when global Di is instantitate', function() {

        it('should be an object', function() {
            expect(this.JSkeleton.di).to.be.an('object');
        });

        it('should be DI.dependencies an object', function() {
            expect(this.JSkeleton.di.dependencies).to.be.an('object');
        });
    });

    // "local" DI behavior:
    describe('when local DI has options', function() {
        beforeEach(function() {
            this.options = {
                globalDi: this.JSkeleton.di
            };
            this.localDi = new JSkeleton.Di(this.options);
        });

        it('should has a globalDi as instance', function() {
            expect(this.localDi.globalDi).to.eql(this.JSkeleton.di);
        });

        it('should has a dependencies as empty object', function() {
            expect(this.localDi).to.include.keys('dependencies');
        });


    });

    describe('when an a service is exposed to factory and injector', function() {

        // Service
        JSkeleton.Service.factory('fooService', {});

        it('should be "fooService" inside factory', function() {
            expect(JSkeleton.factory.get('fooService')).to.be.an('object');
        });

        it('should be a global DI', function() {
            expect(JSkeleton.di).to.be.an('object');
        });

    });

    describe('when create method is called', function() {
        // empty factory
        JSkeleton.factory.empty();

        JSkeleton.Service.factory('fooService', {
            say: function() {
                return 'hello';
            }
        });

        beforeEach(function() {
            this.DI = new JSkeleton.Di();
            this.fakeClass = function(fooService) {
                return fooService;
            };
        });

        it('should be called create method of DI with parameters', function() {
            var spy = sandbox.spy(this.DI, 'create');
            this.DI.create({
                Class: this.fakeClass
            }, undefined, {});
            expect(spy.calledOnce).to.be.equal(true);
        });

        it('should be called create method of DI with first param is a string', function() {
            //var spy = sandbox.spy(this.DI, 'create');
            var factoryObj = this.DI.create('fooService', undefined, {});
            expect(factoryObj instanceof JSkeleton.Service).to.be.equal(true);
        });


        it('should be called _resolve method of DI with parameters', function() {
            var spy = sandbox.spy(this.DI, '_resolve');
            this.DI.create({
                Class: this.fakeClass
            }, undefined, {});
            expect(spy.calledOnce).to.be.equal(true);
        });

        it('should be called instantiateClass method of DI with parameters', function() {
            var spy = sandbox.spy(this.DI, 'instantiateClass');
            this.DI.create({
                Class: this.fakeClass
            }, undefined, {});
            expect(spy.calledOnce).to.be.equal(true);
        });

    });

    describe('when store method is called', function() {
        // empty factory
        JSkeleton.factory.empty();

        JSkeleton.Service.factory('fooService', {
            say: function() {
                return 'hello';
            }
        });

        it('should be called store method of DI with factoryKey', function() {
            this.DI = new JSkeleton.Di();
            var instance = this.DI.store('fooService');
            expect(instance instanceof JSkeleton.Service).to.be.equal(true);
        });

    });

    describe('when _resolve method is called', function() {

        beforeEach(function() {
            this.DI = new JSkeleton.Di();
        });

        // empty factory
        JSkeleton.factory.empty();

        JSkeleton.Service.factory('fooService', {

            say: function() {
                return 'hello';
            }
        });

        it('should be called _resolve method of DI without parameters', function() {
            var that = this;
            expect(function() {
                that.DI._resolve();
            }).to.throw('JSkeleton.DI: Unknown dependency');
        });

        it('should be called _resolve method of DI with dependencies', function() {
            var fooServiceObj = JSkeleton.factory.get('fooService'),
                that = this;

            fooServiceObj.dependencies = [{
                key: 1
            }];

            expect(function() {
                that.DI._resolve(fooServiceObj);
            }).to.throw('JSkeleton.DI: Unknown parent class.');
        });

        it('should be called _resolveDependencies method', function() {
            var fooServiceObj = JSkeleton.factory.get('fooService');
            fooServiceObj.dependencies = [{
                key: 1
            }];

            fooServiceObj.Parent = 1;


            var stub = sandbox.stub(this.DI, '_resolveDependencies');
            this.DI._resolve(fooServiceObj);

            expect(stub.calledOnce).to.be.equal(true);
        });

    });


    describe('when _resolveDependencies is called', function() {

        beforeEach(function() {
            this.DI = new JSkeleton.Di();
        });

        // empty factory
        JSkeleton.factory.empty();

        JSkeleton.Service.factory('fooService', {

            say: function() {
                return 'hello';
            }
        });

        it('intance has all properties and methods', function() {
            expect(JSkeleton.Di).to.include.keys(
                'extractDependencyNames'
            );
        });

        it('should be called extractDependencyNames method', function() {
            var options = {
                Class: JSkeleton.factory.get('fooService').constructor,
                Parent: Marionette.Object,
                dependencies: [{
                    key: 1
                }]
            };

            var stub = sandbox.stub(this.DI, '_getDependency');
            expect(this.DI._resolveDependencies(options, {})).to.be.an('object');
        });
    });

});
