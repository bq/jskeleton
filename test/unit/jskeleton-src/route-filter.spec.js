'use strict';

describe('RouteFilters',function(){
    var sandbox = sinon.sandbox.create();

    before(function(){

        this.foo;
        this.Application = Jskeleton.Application.extend({
            routeFilters:function(_routeParams){
                this.foo = _routeParams;
            },
            onFilterError: function(error,_routeParams){
                return {error: error , _routeParams :  _routeParams};
            }
        });
    });

    afterEach(function(){
        sandbox.restore();
    });

    describe('when app with one routeFilter',function(){

        before(function(){
            this.application = new this.Application();

        });

        it('should be filterStack property and be Array', function(){
            expect(this.application.filterStack).to.be.an('Array');
        });

        it('should be filterStack property and has length of 1 ', function(){
            expect(this.application.filterStack.length).to.equal(1);
        });





    });

    describe('when route change and pass filter', function(){

        before(function(){
            this.application = new this.Application();
            this.routeSpy = sinon.spy(this.application,'_routeFilterProcessing');
        });

        it('should be called method _routeFilterProcessing', function(){
            this.application._navigateTo('foo/bar',{},undefined);
            expect(this.routeSpy).to.have.been.calledWith('foo/bar',{},undefined);
        });

        it('should return true', function(){
            this.application._navigateTo('foo/bar',{},undefined);
            expect(this.routeSpy.returned(true)).to.be.true;

        });

    });


    describe('when route change and no pass filter', function(){

        before(function(){

            this.Application = Jskeleton.Application.extend({
                routeFilters:function(_routeParams){
                    return _routeParams;
                },
                onFilterError: function(error,_routeParams){
                    return {error: error , _routeParams :  _routeParams};
                }
            });

            this.myApp = new this.Application();
            this.triggerSpy = sinon.spy(this.myApp,'trigger');
            this.errorSpy = sinon.spy(this.myApp,'onFilterError');
        });

        it('should notify me after filter no passing', function(){
            this.myApp._navigateTo('foo/bar',{},undefined);
            expect(this.triggerSpy).to.have.been.calledWith('filter:error');
        });

        it('should call after filter no passing', function(){
            this.myApp._navigateTo('foo/bar',{},undefined);
            expect(this.errorSpy).to.have.been.called;
        });
    });
});
