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

});