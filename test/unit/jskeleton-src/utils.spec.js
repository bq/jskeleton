/*globals require,define,describe,it, JSkeleton, before */
/* jshint unused: false */

describe('In Utils module', function() {
    var sandbox = sinon.sandbox.create();


    afterEach(function() {
        sandbox.restore();
    });

    describe('have a function to set up the prototype chain for subclasses applying Jskeleton.Di properly', function() {
        it('can add a function with dependencies to factory', function() {
            JSkeleton.Utils.FactoryAdd('testFunction', function(myDep) {
                return 'foo';
            });

            expect(JSkeleton.factory.getClass('testFunction')).to.be.a.function;
            expect(JSkeleton.factory.getClass('testFunction')()).to.be.equal('foo');
        });

        it('throw an error if the factory object is already defined', function() {
            expect(JSkeleton.Utils.FactoryAdd.bind(this, 'testFunction', undefined)).to.throw(Error);
        });
    });

    describe('have a function to convert a string with JSON format to a JavaScript object', function() {
        it('returns a JavaScript object', function() {
            var json = "{key: 'value'}";

            expect(JSkeleton.Utils.stringToObject(json)).to.be.an.object;
        });

        it('throws an error if the format is incorrect', function() {
            var json = "{key 'value'}";
            expect(function() {
                JSkeleton.Utils.stringToObject(json);
            }).to.throw('InvalidJsonFormat - ' + json);
        });
    });

});
