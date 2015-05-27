/*globals require,define,describe,it, JSkeleton, before */
/* jshint unused: false */

describe('JSkeleton.CollectionView', function() {

    var sandbox = sinon.sandbox.create();

    afterEach(function() {
        sandbox.restore();
        JSkeleton.modelStore.storage.reset();
    });

    it('When create new CollectionView constructor overrided is called', function() {

        var colView = new JSkeleton.CollectionView();

        expect(colView instanceof JSkeleton.CollectionView).to.be.equal(true);
    });

    it('When buildChildView create new child view', function() {
        var Model = JSkeleton.Model.extend({}),
            model1 = new Model(),
            ChildView = JSkeleton.ItemView.extend({
                model: model1
            }),

            Collection = JSkeleton.Collection.extend({
                model: Model
            }),

            col = new Collection(model1),

            ColView = JSkeleton.CollectionView.extend({
                childView: ChildView
            }),

            colView = new ColView({
                collection: col
            });

        var child = colView.buildChildView(model1, ChildView);
        expect(child.cid).to.be.defined;
        expect(child._app).to.be.defined;
    });

    it('When getChildView get child view', function() {
        var Model = JSkeleton.Model.extend({}),
            model1 = new Model(),
            ChildView = JSkeleton.ItemView.extend({
                model: model1
            }),

            Collection = JSkeleton.Collection.extend({
                model: Model
            }),

            col = new Collection(model1),

            ColView = JSkeleton.CollectionView.extend({
                childView: ChildView
            }),

            colView = new ColView({
                collection: col
            });

        var child = colView.buildChildView(model1, ChildView);
        expect(child.cid).to.be.defined;


        var Child = colView.getChildView(child);

    });

});