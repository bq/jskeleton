/*globals require,define,describe,it, Jskeleton, before */
/* jshint unused: false */

describe('Jskeleton Main Application', function(){
    'use strict';
    describe('when registering and initializer and starting the application', function(){
        before(function(){
            this.fooOptions = {foo : 'bar'};
            this.appOptions = {
                rootEl : '.foo', 
                template: '<h3> Content: </h3> <div class="content"></div> <h3> Footer: </h3> <div class="footer"></div>'
            };
            this.initializeStub = sinon.stub(Jskeleton.Application.prototype, 'initialize');
            this.jskApp = Jskeleton.Application.extend(this.appOptions);
            
            this.app = new this.jskApp();

            this.triggerSpy = sinon.spy(this.app, 'trigger');
            this.initializerStub = sinon.stub();
            this.app.addInitializer(this.initializerStub);

            this.app.start(this.fooOptions);
        });
        
        it('should be and JSkeleton Application class definition', function(){
            expect(Jskeleton).to.have.property('Application').with.length(1);
        });
    
        it('should be and Jskeleton Application instance', function(){
            expect(this.app).to.have.property('start');
        });

        it('should notify me before the start', function(){
            expect(this.triggerSpy).to.have.been.calledWith('before:start', this.fooOptions);
        });

        it('should notify me after the app has started', function(){
            expect(this.triggerSpy).to.have.been.calledWith('start', this.fooOptions);
        });

        it('should call initialize', function() {
             expect(this.initializeStub).to.have.been.called;         
        });

        it('should call the initializer', function() {
            expect(this.initializerStub).to.have.been.called;          
        });

        it('should run the initializer with the context of the app object', function() {
            expect(this.initializerStub).to.have.been.calledOn(this.app);          
        });

        it('should have applications property', function(){
            expect(this.app).to.have.property('applications');
        });

        it('should have global channel', function(){
            expect(this.app).to.have.property('globalChannel');
        });
        
        it('should have global channel called "global"', function(){
            this.app.globalChannel.channelName.should.equal('global');
        });

        it('should have rootEl called ".foo"', function(){
            this.app.rootEl.should.equal('.foo');
        });

    });
    
    describe('when an app has been started, and registering another initializer', function(){
    });
    
});
