describe('Jskeleton Main Application', function() {
    'use strict';
    describe('when registering and initializer and starting the application', function() {
        before(function() {
            this.fooOptions = {
                foo: 'bar'
            };
            this.appOptions = {
                rootEl: '.foo',
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

        it('should be and JSkeleton Application class definition', function() {
            expect(Jskeleton).to.have.property('Application').with.length(1);
        });

        it('should be and Jskeleton Application instance', function() {
            expect(this.app).to.have.property('start');
        });

        it('should notify me before the start', function() {
            expect(this.triggerSpy).to.have.been.calledWith('before:start', this.fooOptions);
        });

        it('should notify me after the app has started', function() {
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

        it('should have applications property', function() {
            expect(this.app).to.have.property('applications');
        });

        it('should have global channel', function() {
            expect(this.app).to.have.property('globalChannel');
        });

        it('should have global channel called "global"', function() {
            this.app.globalChannel.channelName.should.equal('global');
        });

        it('should have rootEl called ".foo"', function() {
            this.app.rootEl.should.equal('.foo');
        });

    });

    describe('when instantiating an app with options specified', function() {
        beforeEach(function() {
            this.fooOptions = 'bar';
            this.app = new Jskeleton.Application({
                fooOptions: this.fooOptions
            });
        });

        it('should merge those options into the app', function() {
            expect(this.app.fooOptions).to.equal(this.fooOptions);
        });

    });

    describe('When instantiating an subapp without region defined', function() {
        before(function() {
            var childAppOpts = {};

            this.ChildApp = Jskeleton.ChildApplication.extend(childAppOpts);

            this.mainAppOpts = {
                applications: {
                    'testChildApp': {
                        appClass: this.ChildApp,
                    }
                }
            };



        });

        it('should return an error with requeriments of an region class', function() {

            expect(Jskeleton.Application.extend(this.mainAppOpts)).to.throw(Error);
        });
    });

    describe('when instantiating an app like a Main app with one childApp', function() {
        before(function() {

            var childAppOpts = {};
            var ChildApp = Jskeleton.ChildApplication.extend(childAppOpts);

            var Layout = Jskeleton.LayoutView.extend({
                regions: {
                    headerRegion: '.header',
                    contentRegion: '.content',
                    footerRegion: '.footer'
                }
            });

            var mainAppOpts = {
                layout: {
                    layoutClass: Layout,
                    template: '<div class="hero-unit">' +
                        '<h1>Aplicación de libros</h1>' +
                        '<h3> Header: </h3>' +
                        '<div class="header"></div>' +
                        '<h3> Contenido: </h3>' +
                        '<div class="content"></div>' +
                        '<h3> Footer: </h3>' +
                        '<div class="footer"></div>' +
                        '</div>'
                },
                applications: {
                    'testChildApp': {
                        appClass: ChildApp,
                        region: 'contentRegion'
                    }
                }
            };
            var MainApp = Jskeleton.Application.extend(mainAppOpts);
            this.mainApp = new MainApp();

            //this.mainApp.start();

        });

        it('should merge those childapp options into the app', function() {
            expect(this.mainApp.applications).to.have.property('testChildApp');
        });

        it('should the mainApp  has all childapp properties', function() {
            expect(this.mainApp.applications.testChildApp).to.include.keys(
                'appClass',
                'region'
            );
        });

        it('should childApps has region property', function() {

            //var region = this.mainApp.applications.testChildApp.region;
            //expect(region).to.have.all.keys(['el', '_parent','$el']);
            //expect(region).to.be.a('object');
            //expect(this.mainApp.applications.testChildApp.region).to.have.all.keys(['el', '_parent','$el']);
        });
    });
});
