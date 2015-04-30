/*globals require,define,describe,it, Jskeleton, before */
/* jshint unused: false */

describe('Router', function() {

    var sandbox = sinon.sandbox.create(),
        router = Jskeleton.Router.getSingleton();

    afterEach(function() {
        sandbox.restore();
    });

    it('exists and is an object', function() {
        expect(router).to.be.an('object');
    });

    it('has all properties and methods', function() {
        expect(Jskeleton.Router.prototype).to.include.keys(
            'replaceSpecialChars',
            'constructor',
            'routes',
            'initialize',
            'route',
            'init',
            'start',
            'execute',
            '_replaceRouteString',
            '_getHandlerNameFromRoute',
            '_getRouteParamsNames',
            '_extractParametersAsObject'
        );
    });

    it('Jskeleton Router has all static methods', function() {
        expect(Jskeleton.Router).to.include.keys(
            'getSingleton',
            'start'
        );
    });

    it('router start', function() {
        var stubInit = sandbox.stub(router, 'init');

        router.start();
        expect(stubInit.calledOnce);
    });


    describe('_replaceRouteString generates expected routes', function() {

        it('with correct params', function() {
            expect(router._replaceRouteString('/book/show/:id', {
                id: 1
            })).to.be.equal('/book/show/1');

            expect(router._replaceRouteString('/book/show/:id/:title', {
                id: 1,
                title: 'my-title-test'
            })).to.be.equal('/book/show/1/my-title-test');

            expect(router._replaceRouteString('/book/show/:id/p-:title)', {
                id: 1,
                title: 'my-title-test'
            })).to.be.equal('/book/show/1/p-my-title-test');
        });

        it('with optional params', function() {

            expect(router._replaceRouteString('/book/show/:id(/:title)', {
                id: 1,
                title: 'my-title-test'
            })).to.be.equal('/book/show/1/my-title-test');

            expect(router._replaceRouteString('/book/show/:id(/:title)', {
                id: 1
            })).to.be.equal('/book/show/1');

            expect(router._replaceRouteString('/book/show(/:id)(/:title)', {
                id: 1
            })).to.be.equal('/book/show/1');

            expect(router._replaceRouteString('/book/show(/:id)(/:title)', {})).to.be.equal('/book/show');
        });

        it('with *path like param', function() {

            expect(router._replaceRouteString('/book/show/:id/*path', {
                id: 15,
                path: 'nested/folder/a.txt'
            })).to.be.equal('/book/show/15/nested/folder/a.txt');

            expect(router._replaceRouteString('*path', {
                path: 'nested/folder/a.txt'
            })).to.be.equal('nested/folder/a.txt');

            expect(router._replaceRouteString('splat/*args/end', {
                args: 'nested/folder'
            })).to.be.equal('splat/nested/folder/end');

            expect(router._replaceRouteString('*myfolder/splat/*args/end', {
                args: 'nested/folder',
                myfolder: 'example/example'
            })).to.be.equal('example/example/splat/nested/folder/end');
        });

        // it('with regular expresions', function() {

        //     expect(router._replaceRouteString('/^(.*?)\/open$/', {
        //         reg: '117-a/b/c'
        //     })).to.be.equal('/117-a/b/c/open');
        // });

    });

    describe('_getHandlerNameFromRoute gemerates expected handler', function() {

        it('with correct params', function() {

            expect(router._getHandlerNameFromRoute('/book/show/:id', {
                id: 1
            })).to.be.equal('onBookShow');

            // FIX multiple params
            expect(router._getHandlerNameFromRoute('/book/show/:id/:title', {
                id: 1,
                title: 'my-title-test'
            })).to.be.equal('onBookShow');
        });

        it('with optional params', function() {

            expect(router._getHandlerNameFromRoute('/book/show/:id(/:title)', {
                id: 1,
                title: 'my-title-test'
            })).to.be.equal('onBookShow');

            expect(router._getHandlerNameFromRoute('/book/show/:id(/:title)', {
                id: 1
            })).to.be.equal('onBookShow');

            expect(router._getHandlerNameFromRoute('/book/show(/:id)(/:title)', {
                id: 1
            })).to.be.equal('onBookShow');

            expect(router._getHandlerNameFromRoute('/book/show(/:id)(/:title)', {})).to.be.equal('onBookShow');
        });

        it('with *path like param', function() {

            expect(router._getHandlerNameFromRoute('/book/show/:id/*path', {
                id: 15,
                path: 'nested/folder/a.txt'
            })).to.be.equal('onBookShow');

            expect(router._getHandlerNameFromRoute('/book/show/*splat', {
                splat: 'nested/folder/a.txt'
            })).to.be.equal('onBookShow');

            expect(router._getHandlerNameFromRoute('/book/show/*splat/end', {
                splat: 'nested/folder'
            })).to.be.equal('onBookShow');

        });

    });

    describe('_getRouteParamsNames', function() {

        it('with valid routeString', function() {

            expect(router._getRouteParamsNames('/book/show/:id')).to.include('id');
            expect(router._getRouteParamsNames('/book/show/:id/:title')).to.include('id', 'title');
            expect(router._getRouteParamsNames('/book/show(/:id)')).to.include('id');
        });

    });

    describe('_extractParametersAsObject gemerates expected object', function() {

        it('with valid route param', function() {
            var routeRegex = router._routeToRegExp('/book/show/:id');

            expect(router._extractParametersAsObject(routeRegex, '/book/show/1', ['id'])).to.be.an('object');
            expect(router._extractParametersAsObject(routeRegex, '/book/show/1', ['id'])).to.include.key('id');
            expect(router._extractParametersAsObject(routeRegex, '/book/show/1', ['id']).id).to.be.equal('1');
        });

        it('with multiple params', function() {
            var routeRegex = router._routeToRegExp('/book/show/:id/:title');

            expect(router._extractParametersAsObject(routeRegex, '/book/show/1/test', ['id', 'title'])).to.be.an('object');
            expect(router._extractParametersAsObject(routeRegex, '/book/show/1/test', ['id', 'title'])).to.include.key('id');
            expect(router._extractParametersAsObject(routeRegex, '/book/show/1/test', ['id', 'title'])).to.include.key('title');
            expect(router._extractParametersAsObject(routeRegex, '/book/show/1/test', ['id', 'title']).id).to.be.equal('1');
            expect(router._extractParametersAsObject(routeRegex, '/book/show/1/test', ['id', 'title']).title).to.be.equal('test');
        });
    });

});
