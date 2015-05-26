/*globals require,define,describe,it, Marionette, JSkeleton,before, beforeEach, after, afterEach */
/* jshint unused: false */

describe('Helper "if" when', function() {

    describe('it does not use operators and', function() {

        var html = '{{#if a}}true{{else}}false{{/if}}';

        it('condition is true', function() {
            var fields = {
                    a: true
                },

                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is false', function() {
            var fields = {
                    a: false
                },

                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('false');
        });

    });

    describe('it uses operator === and', function() {

        var html = '{{#if a "===" b}}true{{else}}false{{/if}}';

        it('condition is true ', function() {
            var fields = {
                    a: 1,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is false ', function() {
            var fields = {
                    a: 1,
                    b: 2
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('false');
        });
    });

    describe('it uses operator == and', function() {

        var html = '{{#if a "==" b}}true{{else}}false{{/if}}';

        it('condition is true ', function() {
            var fields = {
                    a: 1,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is false ', function() {
            var fields = {
                    a: 1,
                    b: 2
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('false');
        });
    });

    describe('it uses operator > and', function() {

        var html = '{{#if a ">" b}}true{{else}}false{{/if}}';

        it('condition is true ', function() {
            var fields = {
                    a: 2,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is false ', function() {
            var fields = {
                    a: 1,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('false');
        });
    });

    describe('it uses operator >= and', function() {

        var html = '{{#if a ">=" b}}true{{else}}false{{/if}}';

        it('condition is true (2>=1)', function() {
            var fields = {
                    a: 2,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is true (1>=1)', function() {
            var fields = {
                    a: 1,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is false ', function() {
            var fields = {
                    a: 1,
                    b: 2
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('false');
        });
    });

    describe('it uses operator < and', function() {

        var html = '{{#if a "<" b}}true{{else}}false{{/if}}';

        it('condition is true ', function() {
            var fields = {
                    a: 1,
                    b: 2
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is false ', function() {
            var fields = {
                    a: 1,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('false');
        });
    });

    describe('it uses operator <= and', function() {

        var html = '{{#if a "<=" b}}true{{else}}false{{/if}}';

        it('condition is true (1<=1)', function() {
            var fields = {
                    a: 1,
                    b: 2
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is true (1<=2) ', function() {
            var fields = {
                    a: 1,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is false ', function() {
            var fields = {
                    a: 2,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('false');
        });
    });

    describe('it uses operator != and', function() {

        var html = '{{#if a "!=" b}}true{{else}}false{{/if}}';

        it('condition is true ', function() {
            var fields = {
                    a: 1,
                    b: 2
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is false ', function() {
            var fields = {
                    a: 1,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('false');
        });
    });

    describe('it uses operator !== and', function() {

        var html = '{{#if a "!==" b}}true{{else}}false{{/if}}';

        it('condition is true ', function() {
            var fields = {
                    a: 1,
                    b: 2
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('true');
        });

        it('condition is false ', function() {
            var fields = {
                    a: 1,
                    b: 1
                },
                template = Marionette.Renderer.render(html, fields);

            expect(template.textContent).to.equal('false');
        });
    });

    it('it uses an invalid operator', function() {
        var html = '{{#if 1 "=" 1}}true{{else}}false{{/if}}';
        var template = Marionette.Renderer.render(html, {});
        expect(template.textContent).to.equal('false');
    });

    it('it uses a valid operator but not second parameter', function(){
        var html = '{{#if 1 "==="}}true{{else}}false{{/if}}';
        var error = 'If template helper error: If you define a operator, you must define a second parameter.';

        expect(function () {
            return Marionette.Renderer.render(html, {});
        }).to.throw(error);
    });

    describe('when it is used to manage tag attributes', function(){

        it('throws an error if it is a block helper', function(){
            var self = this;
            self.html = '<strong  class="{{#if 1 "==="}}true{{else}}false{{/if}}"></strong>';
            self.error = 'A block may only be used inside an HTML element or another block.';

            expect(function () {
                return Marionette.Renderer.render(self.html, {});
            }).to.throw(self.error);
        });

        describe('if it is a inline helper which modify the attribute value', function(){
            before(function(){
                this.html = '<strong  class="{{if assertion "result" "alternative"}}"></strong>';
            });

            it('render the second parameter when the condition is true', function(){
                this.template = Marionette.Renderer.render(this.html, {assertion: true});
                this.attributes = this.template._childNodes['0']._attributes;

                expect(this.attributes.class._nodeValue).to.equal('result');
            });

            it('render the third parameter when the condidition is false', function(){
                this.template = Marionette.Renderer.render(this.html, {assertion: false});
                this.attributes = this.template._childNodes['0']._attributes;

                expect(this.attributes.class._nodeValue).to.equal('alternative');
            });

            it('dont create the attribute if the parameter is empty', function(){
                this.html = '<strong  class="{{if assertion "" "alternative"}}"></strong>';
                this.template = Marionette.Renderer.render(this.html, {assertion: true});
                this.attributes = this.template._childNodes['0']._attributes;

                expect(this.attributes.class._nodeValue).to.equal('undefined');
            });


        });

    });

});
