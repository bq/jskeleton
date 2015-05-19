describe('_getImmediateChildren', function() {
    beforeEach(function() {

        // A suitable view to use as a child
        this.BaseView = JSkeleton.ItemView.extend({
            template: false
        });
    });

    describe('JSkeleton.View', function() {
        beforeEach(function() {
            this.view = new JSkeleton.View();
        });
        it('should return an empty array for getImmediateChildren', function() {
            expect(this.view._getImmediateChildren())
                .to.be.instanceof(Array)
                .and.to.have.length(0);
        });
    });

    describe('JSkeleton.CollectionView', function() {
        describe('when empty', function() {
            beforeEach(function() {
                this.collectionView = new JSkeleton.CollectionView();
            });
            it('should return an empty array for getImmediateChildren', function() {
                expect(this.collectionView._getImmediateChildren())
                    .to.be.instanceof(Array)
                    .and.to.have.length(0);
            });
        });

        describe('when there are children', function() {
            beforeEach(function() {
                this.collectionView = new JSkeleton.CollectionView({
                    collection: new Backbone.Collection([{}, {}]),
                    childView: this.BaseView
                });
                this.collectionView.render();
                this.childOne = this.collectionView.children.findByIndex(0);
                this.childTwo = this.collectionView.children.findByIndex(1);
            });
            it('should return an empty array for getImmediateChildren', function() {
                expect(this.collectionView._getImmediateChildren())
                    .to.be.instanceof(Array)
                    .and.to.have.length(2)
                    .and.to.contain(this.childOne)
                    .and.to.contain(this.childTwo);
            });
        });
    });

    describe('JSkeleton.LayoutView', function() {
        describe('without regions', function() {
            beforeEach(function() {
                this.layoutView = new JSkeleton.LayoutView({
                    template: false
                });
            });
            it('should return an empty array for getImmediateChildren', function() {
                expect(this.layoutView._getImmediateChildren())
                    .to.be.instanceof(Array)
                    .and.to.have.length(0);
            });
        });

        describe('when there are empty regions', function() {
            beforeEach(function() {
                this.layoutView = new JSkeleton.LayoutView({
                    template: '<main></main><footer></footer>',
                    regions: {
                        main: '.main',
                        footer: '.footer'
                    }
                });
                this.layoutView.render();
            });
            it('should return an empty array for getImmediateChildren', function() {
                expect(this.layoutView._getImmediateChildren())
                    .to.be.instanceof(Array)
                    .and.to.have.length(0);
            });
        });

        describe('when there are non-empty regions', function() {
            beforeEach(function() {
                this.layoutView = new JSkeleton.LayoutView({
                    template: '<main></main><footer></footer>',
                    regions: {
                        main: 'main',
                        footer: 'footer'
                    }
                });
                this.layoutView.render();
                this.childOne = new this.BaseView();
                this.childTwo = new this.BaseView();
                this.layoutView.getRegion('main').show(this.childOne);
                this.layoutView.getRegion('footer').show(this.childTwo);
            });
            it('should return an empty array for getImmediateChildren', function() {
                expect(this.layoutView._getImmediateChildren())
                    .to.be.instanceof(Array)
                    .and.to.have.length(2)
                    .and.to.contain(this.childOne)
                    .and.to.contain(this.childTwo);
            });
        });
    });
});