'use strict';
/* globals JSkeleton */

describe('In Behaviors module', function() {

    var behaviors = JSkeleton.behaviors;

    var behaviorTest = Marionette.Behavior;

    it('exists and is an object', function() {
        expect(behaviors).to.be.an('object');
    });

    it('has all namespace properties', function() {
        expect(behaviors).to.include.keys(
            'lookup',
            'defaults',
            'add',
            'get',
            'getDefaults'
        );
    });

    describe('when adding a behavior', function() {

        it('isDefault is optional', function() {
            behaviors.add({
                name: 'behaviorTest',
                behaviorClass: behaviorTest
            });

            behaviors.add({
                name: 'behaviorTest',
                behaviorClass: behaviorTest,
                isDefault: true
            });
        });
    });

    describe('when getting a behavior', function() {

        it('throws "behaviors:behavior:undefined" when not available', function() {
            expect(function() {
                behaviors.get({
                    name: 'undefinedBehavior'
                });
            }).to.throw('behaviors:behavior:undefined');
        });

        it('any behavior are available from behaviors.get()', function() {

            behaviors.add({
                name: 'behaviorTest1',
                behaviorClass: behaviorTest
            });

            behaviors.add({
                name: 'behaviorTest2',
                behaviorClass: behaviorTest,
                isDefault: true
            });

            expect(behaviors.get({
                name: 'behaviorTest1'
            })).to.include.keys('behaviorTest1');


            expect(behaviors.get({
                name: 'behaviorTest2'
            })).to.include.keys('behaviorTest2');

        });

        it('a default behavior are available from behaviors.getDefaults()', function() {

            behaviors.add({
                name: 'behaviorTest3',
                behaviorClass: behaviorTest,
                isDefault: true
            });

            expect(behaviors.getDefaults({
                name: 'behaviorTest3'
            })).to.include.keys('behaviorTest3');

        });

        it('behavior.get() can override defaults options', function() {

            behaviors.add({
                name: 'behaviorTest4',
                behaviorClass: behaviorTest
            });

            expect(behaviors.get({
                name: 'behaviorTest4',
                options: {
                    customParam: true
                }
            })).to.include.keys('behaviorTest4')
                .and.to.have.deep.property('behaviorTest4.customParam', true);

        });

        it('behavior.getDefault() can override defaults options', function() {

            behaviors.add({
                name: 'behaviorTest5',
                behaviorClass: behaviorTest,
                isDefault: true
            });

            expect(behaviors.getDefaults({
                behaviorTest5: {
                    customParam: true
                }
            })).to.include.keys('behaviorTest5')
                .and.to.have.deep.property('behaviorTest5.customParam', true);

        });
    });
});
