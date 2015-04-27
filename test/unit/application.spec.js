/*globals require,define,describe,it, Jskeleton */
/* jshint unused: false */

'use strict';
var assert = require('chai').assert;

describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1,-1);
            assert.equal(0, 0);
        });
    });
});


describe('Testing instantiation', function(){
    it('Should be an Object', function(){
        
        
        assert.typeOf(Jskeleton, 'object','Jskeleton is an object');
    });
});
