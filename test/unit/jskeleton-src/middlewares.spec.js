'use strict';

describe('Application Middlewares', function() {

    describe('when run one middleware', function() {

        before(function() {
            this.Application = JSkeleton.Application.extend({
                middlewares: function() {
                    this.calls.push(1);
                },
                calls: []
            });

            this.myApp = new this.Application();

        });

        it('should be called middleware once', function() {
            this.myApp._navigateTo('foo/bar', {}, undefined);
            expect(this.myApp.calls[0]).to.equal(1);
        });
    });

    describe('when run two  middlewares', function() {

        before(function() {
            this.Application = JSkeleton.Application.extend({
                middlewares: [
                    function() {
                        this.calls.push(1);
                    },
                    function() {
                        this.calls.push(2);
                    }
                ],
                calls: []
            });

            this.myApp = new this.Application();

        });

        it('should be called middlewares twice', function() {
            this.myApp._navigateTo('foo/bar', {}, undefined);
            expect(this.myApp.calls.length).to.equal(2);
        });
    });

    describe('when run three middlewares with params', function() {

        before(function() {
            this.Application = JSkeleton.Application.extend({
                middlewares: [
                    function() {
                        this.calls.push(1);
                    },
                    function() {
                        this.calls.push(2);
                    },
                    function(_routeParams) {
                        this.calls.push(_routeParams);
                    }
                ],
                calls: []
            });

            this.myApp = new this.Application();

        });

        it('should be called middlewares three times', function() {
            this.myApp._navigateTo('foo/bar', {}, undefined);
            expect(this.myApp.calls.length).to.equal(3);
        });

        it('should be called middlewares three times last one with params', function() {

            expect(this.myApp.calls[2]).to.have.property('routeString');
        });
    });
});