var DetailBookView = Marionette.ItemView.extend({
    template: '<strong> Título del libro: </strong> <span class="title">{{title}}</span>' +
        '<strong> Autor del libro: </strong><span class="author">{{author}}</span>' +
        '<strong> Identificador del libro: </strong><span class="id">{{id}}</span>',
    events: {
        'click .title': 'onTitleClicked'
    },
    onTitleClicked: function() {
        window.alert('pene');
    }
});

Jskeleton.factory.add('DetailBookView', DetailBookView);

var BookCollectionView = Marionette.CollectionView.extend({
    childView: DetailBookView,
    events: {
        'click .title': 'onTitleClicked'
    },
    onTitleClicked: function() {
        window.alert('title-clicked');
    }
});

Jskeleton.factory.add('BookCollectionView', BookCollectionView);

var BookDetailsViewController = Jskeleton.ViewController.extend({
    onBookShow: function(params, service) {
        this.context.bookModel = new Backbone.Model({
            title: params.title,
            id: params.id,
            author: params.author || 'desconocido'
        });
    }
});

var BookCollectionViewController = Jskeleton.ViewController.extend({
    onBookList: function(params, service) {
        this.context.bookCollection = new Backbone.Collection([{
            title: 'Juego de tronos',
            id: 165
        }, {
            title: 'El hobbit',
            id: 170
        }, {
            title: 'Cien años de soledad',
            id: 14
        }]);
    }
});

var BookCatalogue = Jskeleton.ChildApplication.extend({
    //ServiceClass: Service,
    routes: {
        'book/show/:title(/:id)': {
            viewControllerClass: BookDetailsViewController,
            // handlerName: 'onStateChange',
            // name: 'home:navigate',
            // triggerEvent: ''
            // viewControllerOptions: {
            //     model: MiModel
            // },
            template: '<span> Detalle de libro: </span> {{@component name="DetailBookView" model=context.bookModel}}',
            eventListener: 'book:details'
        },
        'book/list': {
            viewControllerClass: BookCollectionViewController,
            template: '<span> Listado de libros: </span> {{@component name="BookCollectionView" collection=context.bookCollection}}',
            eventListener: 'book:list'
        }
    }
});


var Layout = Marionette.LayoutView.extend({
    regions: {
        headerRegion: '.header',
        contentRegion: '.content',
        footerRegion: '.footer'
    }
});


var AppMain = Jskeleton.Application.extend({
    rootEl: '.app-container',
    layout: {
        layoutClass: Layout,
        template: '<div class="hero-unit">' +
            '<h1>Aplicación de libros</h1>' +
            '<h3> Header: </h3>' +
            '<div class="header"></div>' +
            '<h3> Contenido: </h3>' +
            '<div class="content"></div>' +
            '<h3> Footer: </h3>' +
            '<div class="footer"></div>' +
            '</div>'
        // TODO:
        //regions: {
        //}
    },
    applications: {
        'bookCatalogue': {
            appClass: BookCatalogue,
            region: 'contentRegion'
        }
    }
});

var app = new AppMain();

app.start();