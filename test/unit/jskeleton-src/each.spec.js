/*globals require,define,describe,it, Marionette, Jskeleton,before, beforeEach, after, afterEach */
/* jshint unused: false */

describe('Helper "each" when', function () {

    it('collection is empty', function () {
        var template = '{{#each people}}<span>{{this}}</span>{{/each}}',
            resultRendered = Marionette.Renderer.render(template, {});

        expect(resultRendered.textContent).to.have.length(0);
    });

    it('it does not use a collection', function () {
        var template = '{{#each}}<span>{{this}}</span>{{/each}}',
            resultRendered = Marionette.Renderer.render(template, {});

        expect(resultRendered.textContent).to.have.length(0);
    });


    describe('collection has elements ', function () {

        var people = [
            {name: 'Yehuda'},
            {name: 'Alan'},
            {name: 'Charles'}
        ];

        it('but has errors', function () {
            var data = {
                people: people
            };
            var template = '{{#each person in people}}<span>{{person}}</span>{{/each}}';
            var error = 'You have to define a valid string name for the iteration in the each helper.';

            expect(function () {
                return Marionette.Renderer.render(template, data);
            }).to.throw(error);
        });

        it('when it does not have an each implementation', function () {
            var data = {
                    people: people
                },
                template = '{{#each "person" in people}}<span id="{{person.name}}"></span>{{/each}}',
                resultRendered = Marionette.Renderer.render(template, data);

            data.people.forEach(function (person) {
                expect(resultRendered.querySelector('#' + person.name)).not.to.be.null;
            });
        });

        it('when it has an each implementation', function () {
            var data = {
                    people: new Backbone.Collection(people)
                },
                template = '{{#each "person" in people}}<span id="{{person.name}}"></span>{{/each}}',
                resultRendered = Marionette.Renderer.render(template, data);

            data.people.each(function (person) {
                expect(resultRendered.querySelector('#' + person.get('name'))).not.to.be.null;
            });
        });
    });
});

