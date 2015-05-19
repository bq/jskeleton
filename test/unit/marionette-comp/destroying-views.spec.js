describe('destroying views', function() {
    'use strict';

    describe('when destroying a JSkeleton.View multiple times', function() {
        beforeEach(function() {
            this.onDestroyStub = this.sinon.spy(function() {
                return this.isRendered;
            });

            this.view = new JSkeleton.View();
            this.view.onDestroy = this.onDestroyStub;

            this.view.destroy();
            this.view.destroy();
        });

        it('should only run the destroying code once', function() {
            expect(this.onDestroyStub).to.have.been.calledOnce;
        });

        it('should mark the view as destroyed', function() {
            expect(this.view).to.have.property('isDestroyed', true);
        });
    });

    describe('when destroying a JSkeleton.ItemView multiple times', function() {
        beforeEach(function() {
            this.onBeforeDestroyStub = this.sinon.stub();

            this.itemView = new JSkeleton.ItemView();
            this.itemView.onBeforeDestroy = this.onBeforeDestroyStub;

            this.itemView.destroy();
            this.itemView.destroy();
        });

        it('should only run the destroying code once', function() {
            expect(this.onBeforeDestroyStub).to.have.been.calledOnce;
        });

        it('should mark the view as destroyed', function() {
            expect(this.itemView).to.have.property('isDestroyed', true);
        });
    });

    describe('when rendering a JSkeleton.ItemView that was previously destroyed', function() {
        beforeEach(function() {
            this.itemView = new JSkeleton.ItemView();
            this.itemView.destroy();
        });

        it('should throw an error', function() {
            expect(this.itemView.render).to.throw('View (cid: "' + this.itemView.cid +
                '") has already been destroyed and cannot be used.');
        });
    });

    describe('when destroying a JSkeleton.CollectionView multiple times', function() {
        beforeEach(function() {
            this.onDestroyStub = this.sinon.stub();

            this.collectionView = new JSkeleton.CollectionView();
            this.collectionView.onDestroy = this.onDestroyStub;

            this.collectionView.destroy();
            this.collectionView.destroy();
        });

        it('should only run the destroying code once', function() {
            expect(this.onDestroyStub).to.have.been.calledOnce;
        });

        it('should mark the view as destroyed', function() {
            expect(this.collectionView).to.have.property('isDestroyed', true);
        });
    });

    describe('when rendering a JSkeleton.CollectionView that was previously destroyed', function() {
        beforeEach(function() {
            this.collectionView = new JSkeleton.CollectionView();
            this.collectionView.destroy();
        });

        it('should throw an error', function() {
            expect(this.collectionView.render).to.throw('View (cid: "' + this.collectionView.cid +
                '") has already been destroyed and cannot be used.');
        });
    });

    describe('when destroying a JSkeleton.CompositeView multiple times', function() {
        beforeEach(function() {
            this.onDestroyStub = this.sinon.stub();

            this.compositeView = new JSkeleton.CompositeView();
            this.compositeView.onDestroy = this.onDestroyStub;

            this.compositeView.destroy();
            this.compositeView.destroy();
        });

        it('should only run the destroying code once', function() {
            expect(this.onDestroyStub).to.have.been.calledOnce;
        });

        it('should mark the view as destroyed', function() {
            expect(this.compositeView).to.have.property('isDestroyed', true);
        });
    });

    describe('when rendering a JSkeleton.CompositeView that was previously destroyed', function() {
        beforeEach(function() {
            this.compositeView = new JSkeleton.CompositeView();
            this.compositeView.destroy();
        });

        it('should throw an error', function() {
            expect(this.compositeView.render).to.throw('View (cid: "' + this.compositeView.cid +
                '") has already been destroyed and cannot be used.');
        });
    });
});