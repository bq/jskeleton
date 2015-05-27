/*globals require,define,describe,it, JSkeleton, before */
/* jshint unused: false */

describe('JSkeleton.CompositeView', function() {

    var sandbox = sinon.sandbox.create();

    afterEach(function() {
        sandbox.restore();
        JSkeleton.modelStore.storage.reset();
    });

    it('When create new CompositeView', function() {

        var compositeView = new JSkeleton.CompositeView();

        expect(compositeView instanceof JSkeleton.CompositeView).to.be.equal(true);
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

            ColView = JSkeleton.CompositeView.extend({
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