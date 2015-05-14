/*globals require,define,describe,it, Jskeleton, before */
/* jshint unused: false */

describe('In Extension module', function() {

    var sandbox = sinon.sandbox.create();

    before(function(){
        var self = this;

        this.spy = sinon.spy();

        this.extension = Jskeleton.extension;
    });

    after(function(){
        sandbox.restore();
    });

    it('exists and is a function', function(){
        expect(this.extension).to.be.a('function');
    });


    describe('when add a new extension', function(){
        before(function(){
            this.extension('MyExtension', 'Application', {foo: 'bar'});
        });

        it('adds Extensions to Jskeleton', function(){
            expect(Jskeleton.MyExtension).not.to.be.undefined;
        });

        it('Extension has the adition properties', function(){
            expect(Jskeleton.MyExtension.prototype.foo).not.to.be.undefined;
        });

        it('throws error if the class to extend doesnt exist', function(){
            expect(this.extension.bind(this,
                'OtherExtension',
                'NoClass',
                {foo: 'bar'}
                )).to.throw(Error);
        });

        it('overrides the Class if the Class already exists', function(){
            this.extension('MyExtension', 'Service', {bar: 'foo'});

            expect(Jskeleton.MyExtension.prototype.foo).to.be.undefined;
            expect(Jskeleton.MyExtension.prototype.bar).not.to.be.undefined;
        });

    });

});
