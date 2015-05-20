'use strict';

var CFG = {
    test: 'TEST',
    test1: 'TEST1',
    test2: 'TEST2',
    test3: 'TEST3'
};

describe('Common module', function() {

    var backupCFG, common = JSkeleton.common;

    before(function() {
        backupCFG = common.getConfig();
    });

    after(function() {
        common.setConfig(backupCFG);
    });

    it('generic test', function() {

        var test = {
            foo: {}
        };

        _.extend(test.foo, {
            test: 'test'
        });

        expect(test.foo.test).to.be.equal('test');

        _.extend(test.foo, {
            test: 'test2'
        });

        expect(test.foo.test).to.be.equal('test2');

        _.extend(test.foo, {
            test: 'test3'
        });

        expect(test.foo.test).to.be.equal('test3');
    });

    it('exists and is an object', function() {
        expect(common).to.be.an('object');
    });

    it('has all namespace properties', function() {
        expect(common).to.include.keys(
            'get',
            'setConfig'
        );
    });

    it('can set its config correctly', function() {
        common.setConfig(CFG);
        expect(common.get('test')).to.be.equal('TEST');
    });

    it('can get & restore all its config correctly', function() {

        common.setConfig(CFG);

        var returnedCFG = common.getConfig();

        expect(returnedCFG.test).to.be.equal(CFG.test);
        expect(returnedCFG.test1).to.be.equal(CFG.test1);
        expect(returnedCFG.test2).to.be.equal(CFG.test2);
        expect(returnedCFG.test3).to.be.equal(CFG.test3);

        var exampleCFG = {
            test: 'BACKUP_TEST',
            test1: 'BACKUP_TEST1',
            test2: 'BACKUP_TEST2',
            test3: 'BACKUP_TEST3'
        };

        common.setConfig(exampleCFG);

        expect(exampleCFG.test).to.be.equal(common.get('test'));
        expect(exampleCFG.test1).to.be.equal(common.get('test1'));
        expect(exampleCFG.test2).to.be.equal(common.get('test2'));
        expect(exampleCFG.test3).to.be.equal(common.get('test3'));

        common.setConfig(CFG);

        returnedCFG = common.getConfig();

        expect(returnedCFG.test).to.be.equal(CFG.test);
        expect(returnedCFG.test1).to.be.equal(CFG.test1);
        expect(returnedCFG.test2).to.be.equal(CFG.test2);
        expect(returnedCFG.test3).to.be.equal(CFG.test3);

        expect(returnedCFG.test).to.be.equal(common.get('test'));
        expect(returnedCFG.test1).to.be.equal(common.get('test1'));
        expect(returnedCFG.test2).to.be.equal(common.get('test2'));
        expect(returnedCFG.test3).to.be.equal(common.get('test3'));

    });

    it('can retrieve setted fields', function() {

        common.set('test', 'TEST-SETTED');
        expect(common.get('test')).to.be.equal('TEST-SETTED');

    });

    it('throw an exception when a field is undefined', function() {

        common.setConfig(CFG);

        expect(function() {
            common.get('UndefinedField');
        }).to.throw('UndefinedCommonField "UndefinedField"');

    });

    it('return default value when field is undefined', function() {

        common.setConfig(CFG);

        expect(common.getOrDefault('UndefinedField', 'test')).to.be.equal('test');

    });


});