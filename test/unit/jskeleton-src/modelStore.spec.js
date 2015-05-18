/*globals require,define,describe,it, Jskeleton, before */
/* jshint unused: false */

describe('modelStore', function() {

    var sandbox = sinon.sandbox.create(),
        store = Jskeleton.store,
        BarModel = Jskeleton.Model.extend({});

    afterEach(function() {
        sandbox.restore();
    });

    it('modelStorage exist', function() {
        expect(Jskeleton.modelStore.storage).to.have.length(0);
    });

    it('intance has all properties and methods', function() {
        expect(Jskeleton.ModelStore.prototype).to.include.keys(
            'add',
            'remove',
            'get',
            'getAll',
            'classExist',
            'modelExist'
        );
    });

    describe('call store function', function() {
        after(function() {
            Jskeleton.modelStore.storage.reset();
        });

        it('without classConstructor param', function() {
            expect(function() {
                Jskeleton.store();
            }).to.throw("classConstructor must be exist");
        });

        it('return new model instance', function() {
            var model = Jskeleton.store(BarModel),
                res = model instanceof BarModel;
            expect(res).to.be.equal(true);
        });

        it('return model instance from modelStorage', function() {
            var model = Jskeleton.store(BarModel, {
                    id: 1,
                    title: 'foo'
                }),
                model2 = Jskeleton.store(BarModel, {
                    id: 1
                });
            expect(model2.get('id')).to.be.equal(1);
            expect(model2.get('title')).to.be.equal('foo');
        });
    });


    describe('add new model instance with correct params', function() {

        it('into a new class organization', function() {
            var model = new BarModel({
                id: 1,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);
        });

        it('into a class organization', function() {
            var model2 = new BarModel({
                id: 2,
                title: 'foo'
            });
            Jskeleton.modelStore.add(model2);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model2.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(2);
        });
    });

    describe('add new model instance with invalid params', function() {
        after(function() {
            Jskeleton.modelStore.storage.reset();
        });

        it('return error', function() {
            var model = {
                id: 1,
                title: 'bar'
            };
            expect(function() {
                Jskeleton.modelStore.add(model);
            }).to.throw("model added must be exist and must be an instance of Backbone.Model");
        });
    });

    describe('update model instance', function() {
        afterEach(function() {
            Jskeleton.modelStore.storage.reset();
        });

        it('into a class organization', function() {
            var model = new BarModel({
                id: 3,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);

            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);

            model.set({
                title: 'foo'
            });

            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models[0].get('title')).to.be.equal('foo');
        });

        it('into a class organization with diferent idAttribute', function() {
            var FooModel = Jskeleton.Model.extend({
                idAttribute: 'isbn'
            });
            var model = new FooModel({
                isbn: '1234',
                title: 'foo'
            });

            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);

            model.set({
                title: 'foo2'
            });

            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models[0].get('title')).to.be.equal('foo2');
        });
    });

    describe('get model instance', function() {
        after(function() {
            Jskeleton.modelStore.storage.reset();
        });

        it('with correct params', function() {
            var model = new BarModel({
                id: 3,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);
            var _model = Jskeleton.modelStore.get(3, BarModel);

            expect(_model.get('title')).to.be.equal('bar');
        });

        it('with diferent idAttribute', function() {
            var FooModel = Jskeleton.Model.extend({
                idAttribute: 'isbn'
            });

            var model = new FooModel({
                isbn: '1234',
                title: 'foo'
            });

            Jskeleton.modelStore.add(model);
            var _model = Jskeleton.modelStore.get('1234', FooModel);

            expect(_model.get('title')).to.be.equal('foo');
        });

        it('with invalid params', function() {
            var model = new BarModel({
                id: 3,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);

            expect(function() {
                Jskeleton.modelStore.get(3);
            }).to.throw("classConstructor must be exist");

            expect(function() {
                Jskeleton.modelStore.get(undefined, BarModel);
            }).to.throw("modelId must be exist");
        });
    });

    describe('All models by Class', function() {
        after(function() {
            Jskeleton.modelStore.storage.reset();
        });

        it('with correct params', function() {
            var model = new BarModel({
                id: 1,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);
            var model2 = new BarModel({
                id: 2,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model2);
            expect(Jskeleton.modelStore.getAll(BarModel)).to.have.length(2);
        });

        it('with invalid params', function() {
            expect(function() {
                Jskeleton.modelStore.getAll({});
            }).to.throw("classConstructor must be exist");
        });
    });

    describe('remove model instance', function() {
        after(function() {
            Jskeleton.modelStore.storage.reset();
        });

        it('with correct params', function() {
            var model = new BarModel({
                id: 3,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);

            Jskeleton.modelStore.remove(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(0);
        });

        it('with diferent idAttribute', function() {
            Jskeleton.modelStore.storage.reset();

            var FooModel = Jskeleton.Model.extend({
                idAttribute: 'isbn'
            });

            var model = new FooModel({
                isbn: '1234'
            });

            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);

            Jskeleton.modelStore.remove(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(0);
        });

        it('with invalid params', function() {
            Jskeleton.modelStore.storage.reset();

            var model = new BarModel({
                id: 3,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);

            expect(function() {
                Jskeleton.modelStore.remove({});
            }).to.throw("model added must be exist and must be an instance of Backbone.Model");
        });
    });

    describe('classExist method', function() {
        after(function() {
            Jskeleton.modelStore.storage.reset();
        });

        it('class exist by model instance', function() {
            var model = new BarModel({
                id: 1,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.classExist(model)).to.be.equal(true);
        });

        it('class exist by classConstructor', function() {
            var model = new BarModel({
                id: 2,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.classExist(BarModel)).to.be.equal(true);
        });

        it('class not exist', function() {
            var model = new BarModel({
                id: 3,
                title: 'bar'
            });
            Jskeleton.modelStore.storage.reset();
            expect(Jskeleton.modelStore.classExist(model)).to.be.equal(false);
        });

        it('return error', function() {
            expect(function() {
                Jskeleton.modelStore.classExist('test');
            }).to.throw("param must be exist and must be a function or a instance model");
        });
    });

    describe('modelExist method', function() {
        after(function() {
            Jskeleton.modelStore.storage.reset();
        });

        it('model exist', function() {
            var model = new BarModel({
                id: 1,
                title: 'bar'
            });
            Jskeleton.modelStore.add(model);
            expect(Jskeleton.modelStore.modelExist(1, BarModel)).to.be.equal(true);
        });

        it('model not exist', function() {
            var model = new BarModel({
                id: 1,
                title: 'bar'
            });
            Jskeleton.modelStore.storage.reset();
            expect(Jskeleton.modelStore.modelExist(1, BarModel)).to.be.equal(false);
        });
    });

    describe('when Collection added model instance', function() {
        after(function() {
            Jskeleton.modelStore.storage.reset();
        });

        it('with valid model instance object', function() {
            var model = new BarModel({
                id: 1,
                title: 'bar'
            });

            var collection = new Jskeleton.Collection();
            collection.add(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);
        });

        it('with literal object attributes', function() {
            var attributes = {
                id: 1,
                title: 'test'
            };
            var collection = new Jskeleton.Collection();
            collection.add(attributes);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);
        });

        it('with Collection.Model attribute setted', function() {
            var model = new BarModel({
                id: 1,
                title: 'bar'
            });

            var CollectionBar = Jskeleton.Collection.extend({
                model: BarModel
            });

            var collection = new CollectionBar();
            collection.add(model);
            expect(Jskeleton.modelStore.storage.models[0].get('Class')).to.be.equal(model.constructor);
            expect(Jskeleton.modelStore.storage.models[0].get('instances').models).to.have.length(1);
        });
    });


});
