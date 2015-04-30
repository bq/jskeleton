var DetailBookView = Jskeleton.ItemView.extend({
    initialize: function() {},
    template: '<strong> Título del libro: </strong> <span class="title">{{title}}</span>' +
        '<strong> Autor del libro: </strong><span class="author">{{author}}</span>' +
        '<strong> Identificador del libro: </strong><span class="id">{{id}}</span> <button class="view-action"> Comprar </button> <button class="view-back"> Volver al listado </button>',
    events: {
        'click .view-action': 'onActionClicked',
        'click .view-back': 'onBackClicked'
    },
    onActionClicked: function() {
        this.trigger('buy', this.model.get('title'));
    },
    onBackClicked: function() {
        this.channel.trigger('book:list');
    }
});

Jskeleton.factory.add('DetailBookView', DetailBookView);

var ItemBookView = Jskeleton.ItemView.extend({
    template: '<strong> Título del libro: </strong> <span class="title">{{title}}</span>' +
        '<strong> Autor del libro: </strong><span class="author">{{author}}</span>' +
        '<strong> Identificador del libro: </strong><span class="id">{{id}}</span> <button class="view-action"> Ver detalles </button>',
    events: {
        'click .view-action': 'onActionClicked'
    },
    onActionClicked: function() {
        this.channel.trigger('book:details', {
            id: this.model.get('id'),
            title: this.model.get('title'),
            author: this.model.get('author')
        });
    }
});


var BookCollectionView = Jskeleton.CollectionView.extend({
    childView: ItemBookView
});

Jskeleton.factory.add('BookCollectionView', BookCollectionView);

var BookDetailsViewController = Jskeleton.ViewController.extend({
    events: {
        'buy @component.DetailBookView': 'onLink'
    },
    onLink: function(title) {
        console.log('Libro comprado: ', title);
    },
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
    },
    events: {
        triggers: [
            'book:details',
            'book:list'
        ]
        // listen: [
        // 'all'
        // ]
    }
});


var Layout = Jskeleton.LayoutView.extend({
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

app.router.route("*notFound", "page", function() {
    console.log("404 error", arguments);
});

app.start();