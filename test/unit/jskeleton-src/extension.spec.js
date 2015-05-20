/*globals require,define,describe,it, JSkeleton, before */
/* jshint unused: false */

describe.skip('In Extension module', function() {

    var sandbox = sinon.sandbox.create();

    before(function() {
        var self = this;

        this.spy = sinon.spy();

        this.extension = JSkeleton.extension;
    });

    after(function() {
        sandbox.restore();
    });

    it('exists and is a function', function() {
        expect(this.extension).to.be.a('function');
    });


    describe('when add a new extension', function() {
        before(function() {
            this.extension('MyExtension', 'Application', {
                foo: 'bar'
            });
        });

        it('adds Extensions to JSkeleton', function() {
            expect(JSkeleton.MyExtension).not.to.be.undefined;
        });

        it('Extension has the adition properties', function() {
            expect(JSkeleton.MyExtension.prototype.foo).not.to.be.undefined;
        });

        it('throws error if the class to extend doesnt exist', function() {
            expect(this.extension.bind(this,
                'OtherExtension',
                'NoClass', {
                    foo: 'bar'
                }
            )).to.throw('You must specify a existent JSkeleton Class');
        });

        it('throws error if the extension is not correct', function() {
            expect(this.extension.bind(this,
                'MyExtension',
                'Application'
            )).to.throw('You must spefify a correct extension object');
        });

        it('overrides the Class if the Class already exists', function() {
            this.extension('MyExtension', 'Service', {
                bar: 'foo'
            });

            expect(JSkeleton.MyExtension.prototype.foo).to.be.undefined;
            expect(JSkeleton.MyExtension.prototype.bar).not.to.be.undefined;
        });

    });

});