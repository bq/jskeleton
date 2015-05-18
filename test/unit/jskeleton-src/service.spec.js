'use strict';

describe('Service', function(){

    before(function(){
        this.Service = Jskeleton.Service.extend({});

        this.myService = new this.Service();
    });

    it('Should be Service instance', function(){
        expect(this.myService).to.be.an('object');
    });

    it('should be myService instance of Service', function(){
        expect(this.myService).to.be.an.instanceof(this.Service);
    });

    describe('when service is instantitate with options', function(){
        before(function (){
            this.Service = Jskeleton.Service.extend({
                foo: function(){
                    return 'bar';
                }
            });

            this.myService = new this.Service();
        });

        it('should has a method foo', function(){
            expect(this.myService).to.have.property('foo');
        });
    });
});
