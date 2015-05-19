/*globals require,define,describe,it, Marionette, JSkeleton,before, beforeEach, after, afterEach */
/* jshint unused: false */

describe('Helper "if" when', function() {

    describe('it does not use operators and', function() {

        var html = "{{#if a}}true{{else}}false{{/if}}";

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

    it('uses an invalid operator', function() {

        var html = '{{#if 1 "=" 1}}true{{else}}false{{/if}}';

        var template = Marionette.Renderer.render(html, {});

        expect(template.textContent).to.equal('false');
    });

});